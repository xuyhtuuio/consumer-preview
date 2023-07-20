import gIcon from  "@/components/common/trs-icon"
import gBreadcrunm from  "@/components/common/comBreadcrumbList.vue"
import gTableCard from "@/components/common/comTableCard.vue"
import gButton from "@/components/common/comButton.vue"
const data = [gIcon,gBreadcrunm,gTableCard,gButton]

export default function (Vue) {
  data.forEach(cpt => {
    Vue.component(cpt.name, cpt)
  });
}