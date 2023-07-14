import gIcon from  "@/components/common/trs-icon"
import gBreadcrunm from  "@/components/common/comBreadcrumbList.vue"
import gTableCard from "@/components/common/comTableCard.vue"
const data = [gIcon,gBreadcrunm,gTableCard]

export default function (Vue) {
  data.forEach(cpt => {
    Vue.component(cpt.name, cpt)
  });
}