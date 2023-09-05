import gIcon from '@/components/common/trs-icon'
import gBreadcrunm from '@/components/common/comBreadcrumbList'
import gTableCard from '@/components/common/comTableCard'
import gButton from '@/components/common/comButton'
const data = [gIcon, gBreadcrunm, gTableCard, gButton]

export default function (Vue) {
  data.forEach(cpt => {
    Vue.component(cpt.name, cpt)
  });
}
