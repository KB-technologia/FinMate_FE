<script setup>
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import Sidebar from "@/components/info/Sidebar.vue";
import PortfolioDataView from "@/components/info/portfolio/PortfolioData.vue";
import PortfolioEmptyView from "@/components/info/portfolio/PortfolioEmpty.vue";
import { ref, onMounted } from "vue";
import { getPortfolio } from "@/api/portfolio/portfolio.js";
import FooterComponent from "../../components/allshared/FooterComponent.vue";
import RightPanel from "@/components/info/RightPanel.vue";

const portfolio = ref(null);

async function fetchPortfolio() {
  try {
    const res = await getPortfolio();
    portfolio.value = res.data;
    console.log("포트폴리오 로딩 성공");
  } catch (e) {
    console.error("포트폴리오 로딩 실패", e);
    portfolio.value = null;
  }
}
onMounted(fetchPortfolio);
</script>

<template>
  <div class="portfolio">
    <TopNavigationBar />
    <div class="scroll-able">
      <div class="myportfolio-container">
        <Sidebar />
        <RightPanel :scroll="false" class="portfolio-right-panel">
          <PortfolioDataView
            v-if="portfolio"
            :portfolio="portfolio"
            @requestRefresh="fetchPortfolio"
          />
          <PortfolioEmptyView v-else @save="fetchPortfolio" />
        </RightPanel>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>
<style scoped>
.portfolio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.portfolio::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/backgroundImage/background_myinfo.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: -1;
}

.scroll-able {
  padding-top: 1vh;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 2vh;
}

.myportfolio-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 5.35rem;
}
</style>
