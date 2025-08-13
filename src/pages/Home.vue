<script setup>
import { ref, reactive, onActivated, computed, onMounted, watch, nextTick } from "vue";
import Masonry from "masonry-layout";
import { useRoute, useRouter } from "vue-router";
import { encode } from "../utils/base64";
import axios from "axios";
import { useTabStore } from "../stores/tabStore";
const API_BASE_URL = ref(window.ENV_CONFIG && window.ENV_CONFIG.VITE_API_URL);
const tabStore = useTabStore();
const route = useRoute();
const router = useRouter();

// Tab 标题列表
const tabNames = ["美团", "饿了么", "京东外卖", "连锁餐饮", "电商", "打车出行", "本地生活", "特惠酒店", "快递优惠"];
const selectedTab = computed(() => tabStore.selectedTab);

// 切换 Tab
const selectTab = (tab) => {
  tabStore.setSelectedTab(tab.title);
};

// 存储每个 tab 的数据
const tabData = reactive({
  dataMap: {},
});

const tabLoadingStatus = ref({});

// 请求函数
const requestListData = async (name) => {
  try {
    const res = await axios.get(`${API_BASE_URL.value}/list?name=${encodeURIComponent(name)}`);
    return { name, data: res.data.data.data };
  } catch (err) {
    return { name, data: null };
  }
};
let authCode = ref(false);
let authMsg = ref();
// 获取所有数据
const GetAll = () => {
  axios
    .get(`${API_BASE_URL.value}/list`)
    .then((res) => {
      if (res.data.code == 203) {
        authCode.value = true;
        authMsg.value = res.data.msg;
        showNotify({ type: "danger", message: authMsg, duration: 10000 });
      } else {
        authCode.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const hasLoaded = ref(false);
const fetchDataAndCache = async () => {
  if (hasLoaded.value) return;
  const promises = tabNames.map((name) => requestListData(name));
  const results = await Promise.all(promises);
  results.forEach(({ name, data }) => {
    tabData.dataMap[name] = data;
    tabLoadingStatus.value[name] = !!data; // 标记该 Tab 数据已加载
  });
  hasLoaded.value = true;

  // 数据加载完成后初始化当前 tab 的 Masonry
  nextTick(() => {
    initMasonryForTab(selectedTab.value);
  });
};

// 保存每个 tab 的 grid ref
const gridRefs = ref({});
const masonryInstances = ref({});

const setGridRef = (el, name) => {
  if (el) {
    gridRefs.value[name] = el;
  }
};

// 初始化指定 tab 的 Masonry
const initMasonryForTab = (name) => {
  // 给予一个小延时确保 DOM 已经完全渲染
  setTimeout(() => {
    const el = gridRefs.value[name];
    if (!el) return;

    // 如果已有实例，先销毁
    if (masonryInstances.value[name]) {
      masonryInstances.value[name].destroy();
    }

    const containerWidth = el.clientWidth;
    const columns = 2;
    const gutter = 12;
    const columnWidth = Math.floor((containerWidth - gutter) / columns);

    const masonry = new Masonry(el, {
      itemSelector: ".grid-item",
      columnWidth: columnWidth,
      gutter: gutter,
      percentPosition: false,
      horizontalOrder: true,
      initLayout: true,
    });

    masonryInstances.value[name] = masonry;

    // 强制重新布局
    setTimeout(() => {
      masonry.layout();
    }, 100);
  }, 50);
};

// 监听 Tab 切换
watch(
  () => tabStore.selectedTab,
  (newTab) => {
    if (!tabLoadingStatus.value[newTab]) return;

    nextTick(() => {
      // 给予足够的时间让 DOM 更新
      setTimeout(() => {
        initMasonryForTab(newTab);
      }, 100);
    });
  }
);
// 监听 Tab 切换
watch(
  () => tabStore.selectedTab,
  (newTab) => {
    nextTick(() => {
      if (tabLoadingStatus.value[newTab]) {
        initMasonryForTab(newTab);
      }
    });
  },
  { immediate: true }
);

// 激活时重新布局（适用于 keep-alive）
onActivated(() => {
  initMasonryForTab(selectedTab.value);
});

// 窗口变化时重新布局
window.addEventListener("resize", () => {
  nextTick(() => {
    const currentTab = selectedTab.value;
    const instance = masonryInstances.value[currentTab];
    if (instance) {
      instance.layout();
    }
  });
});

onMounted(() => {
  GetAll();
  if (!tabStore.selectedTab) {
    tabStore.setSelectedTab("美团");
  }
  fetchDataAndCache();
  detectDevice();
});

const GetDetails = (item) => {
  router.push({ path: "/details", query: { activity: encode(JSON.stringify(item)) } });
};
let deviceType = ref(true);
// 判断浏览器环境
const detectDevice = () => {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 430;

  if (isMobile || isSmallScreen) {
    deviceType.value = true;
  } else {
    deviceType.value = false;
  }
};
</script>

<template>
  <div v-if="deviceType">
    <div class="head">
      <img
        class="img"
        src="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/74366c6f9b892d27f6f0a9d33e83c0985f5104e39994820e2ee56a7f9487e4e67a47aae968bbf6e667f0b2c3bc33ba08?pictype=scale&from=30013&version=3.3.3.3&fname=welfare_logo.png&size=1080"
        alt=""
      />
    </div>
    <div>
      <van-tabs
        :swipe-threshold="5"
        swipeable
        animated
        sticky
        color="#6227CF"
        title-active-color="#9926FF"
        @click-tab="selectTab"
        v-model:active="tabStore.selectedTab"
      >
        <van-tab v-for="(name, index) in tabNames" :key="index" :title="name" :name="name">
          <div v-show="tabData.dataMap[name]" class="deals-grid" :ref="(el) => setGridRef(el, name)">
            <div
              class="card grid-item"
              v-for="(item, index) in tabData.dataMap[name]"
              :key="index"
              @click="GetDetails(item)"
            >
              <div class="card-image">
                <img class="img" referrer="no-referrer|origin|unsafe-url" :src="item.img" alt="" />
              </div>
              <div class="card-logo">
                <img referrer="no-referrer|origin|unsafe-url" :src="item.icon" alt="翻山羊线报网" />
              </div>
              <div class="card-content">
                <div class="card-brand">{{ item.cate_name }}线报</div>
                <h3 class="card-title">{{ item.act_name }}</h3>
                <div class="card-availability">截止时间：{{ item.end_date }}</div>
                <div class="card-actions">
                  <button class="visit-btn">
                    <i class="fas fa-external-link-alt"></i>
                    <span>访问</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="ts" v-show="!tabData.dataMap[name]">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
  <div v-else>请在手机端打开</div>
</template>
<style src="../css/font-awesome.css"></style>
<style scoped>
.deals-grid {
  max-width: 430px !important;
  /* display: grid; */
  /* grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); */
  gap: 12px;
  margin: 12px 12px 0 10px !important;
  grid-template-columns: repeat(2, 1fr);
  box-sizing: border-box;
}
.grid-item {
  /* width: calc(50% - 4px);  */
  width: 48.8%;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.head {
  width: 100%;
  height: 159px;
  /* border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px; */
  overflow: hidden;
}
.img {
  width: 100%;
  height: 100%;
}
.ts {
  width: 100%;
  height: fit-content;
  text-align: center;
  margin-top: 20px;
}
@font-face {
  font-family: "FaSolid";
  font-weight: 900;
  src: url("../assets/font/fa-solid-900.woff2") format("woff2"), url("../assets/font/fa-solid-900.ttf") format("ttf");
  font-display: swap;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: revert-layer;
}
img {
  max-width: 100%;
  height: auto;
}
.card {
  /* box-shadow: 0 0 10px rgba(116, 116, 116, 0.08); */
  background-color: #fff;
  /* padding: 10px 0px; */
  border-radius: 6px;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.card-image {
  width: 100%;
  height: 100px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}
.card-logo {
  width: 45px;
  height: 45px;
  top: 8px;
  right: 8px;
  border-radius: 8px;
  position: absolute;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  z-index: 10;
}
.card-logo img {
  max-width: 28px;
  max-height: 28px;
  object-fit: contain;
  border-radius: 6px;
}
.card-content {
  padding: 10px;
  box-sizing: border-box;
}
.card-brand {
  font-size: 8px;
  margin-bottom: 3px;
  color: #666;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.card-title {
  font-size: 13px;
  text-align: justify;
  line-height: 1.2;
  margin-bottom: 6px;
  /* -webkit-line-clamp: 2; */
  font-weight: 600;
  color: #333;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: "FaSolid";
}
.card-availability {
  font-size: 10px;
  color: #888;
}
.card-actions {
  gap: 5px;
  margin-top: 8px;
  display: flex;
}
.about-btn,
.visit-btn {
  flex: 1;
  padding: 5px 8px;
  border: none;
  border-radius: 8px;
  font-size: 10px;
  gap: 3px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.about-btn {
  background: #f8f9fa;
  color: #495057;
}
.visit-btn {
  /* background: #007bff; */
  background-color: rgb(153 38 255);
  color: white;
}
.about-btn i,
.visit-btn i {
  font-size: 8px;
}
.fa-external-link-alt:before,
.fa-up-right-from-square:before {
  content: "\f35d";
}
.fa-solid,
.fas {
  font-family: "FaSolid";
  font-weight: 900;
}
</style>
