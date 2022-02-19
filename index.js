import { restoreWarbandData } from './modules/warbandDataCoordinator.js'
import { loadComponents } from 'componentLoader'
import { resolveUrls } from 'componentUrlResolver'
const { createApp } = Vue
const { createRouter, createWebHashHistory } = VueRouter

const restoreWarbandDataPromise = restoreWarbandData()

const components = await loadComponents(
    resolveUrls([
        'App',
        'Setup',
        'Main',
        'CharacterIndex',
        'CharacterInfo',
        'CharacterEdit',
        'PlayerEdit',
        'ItemIndex',
        'TrainerSimulator',
        'Upload',
        'Dropdown',
        'Checkbox',
        'CheckboxArray',
        'FilterContainer',
        'BooleanCondition',
        'NumericCondition',
        'TextCondition',
        'DamageCondition',
        'Table',
        'Modal',
        'ItemTooltip',
        'Character',
    ])
)
const componentLookup = new Map(components.map(x => [x.name, x]))

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Main',
            component: componentLookup.get('Main'),
        },
        {
            path: '/Setup',
            name: 'Setup',
            component: componentLookup.get('Setup'),
        },
        {
            path: '/character-index',
            name: 'CharacterIndex',
            component: componentLookup.get('CharacterIndex'),
        },
        {
            path: '/character/:troopID',
            name: 'Character',
            component: componentLookup.get('CharacterInfo'),
            props: true,
        },
        {
            path: '/character-edit/:troopID',
            name: 'CharacterEdit',
            component: componentLookup.get('CharacterEdit'),
            props: true,
        },
        {
            path: '/player-edit',
            name: 'PlayerEdit',
            component: componentLookup.get('PlayerEdit'),
        },
        {
            path: '/item-index',
            name: 'ItemIndex',
            component: componentLookup.get('ItemIndex'),
        },
        {
            path: '/trainer-simulator',
            name: 'TrainerSimulator',
            component: componentLookup.get('TrainerSimulator'),
        },
    ],
})

await restoreWarbandDataPromise

const div = document.createElement('div')
document.body.append(div)
const app = createApp(componentLookup.get('App'))

for (const component of components)
    app.component(component.name, component)

app.use(router)
app.mount(div)
