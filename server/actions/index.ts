import harvest from './farm/harvest'
import plantSeed from './farm/plantSeed'
import upgradeBuilding from './territory/upgradeBuilding'
import getTerritoryData from './territory/getData'
import collectResources from './territory/collectResources'

type ActionHandler = (context: ActionContext) => Promise<any>

// Key là chuỗi 'category/actionName', value là hàm handler tương ứng.
export const actions: Record<string, ActionHandler> = {
  'farm/plantSeed': plantSeed,
  'farm/harvest': harvest,
  'territory/upgradeBuilding': upgradeBuilding,
  'territory/getData': getTerritoryData,
  'territory/collectResources': collectResources,
}
