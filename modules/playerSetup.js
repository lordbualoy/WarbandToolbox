import { troops } from './warbandHighLevelData.js'
const { ref, computed, watch } = Vue

export function createBackground() {
    const sexOptions = [
        { value: 'm', text: 'Male' },
        { value: 'f', text: 'Female' },
    ]
    const sex = ref(sexOptions[0].value)
    const fatherOptions = [
        { value: 'noble', text: 'Noble' },
        { value: 'merchant', text: 'Merchant' },
        { value: 'warrior', text: 'Warrior' },
        { value: 'hunter', text: 'Hunter' },
        { value: 'nomad', text: 'Nomad' },
        { value: 'thief', text: 'Thief' },
    ]
    const father = ref(fatherOptions[0].value)
    const childhoodOptions = [
        { value: 'page', text: 'Page' },
        { value: 'craftsman', text: 'Craftsman\'s Apprentice' },
        { value: 'shopAssitant', text: 'Shop Assistant' },
        { value: 'urchin', text: 'Urchin' },
        { value: 'steppeChild', text: 'Steppe Child' },
    ]
    const childhood = ref(childhoodOptions[0].value)
    const adulthoodOptions = computed(() => {
        const firstOption = sex.value === 'm' ? { value: 'squire', text: 'Squire' } : { value: 'ladyInWaiting', text: 'Lady in waiting' }
        return [
            firstOption,
            { value: 'troubadour', text: 'Troubadour' },
            { value: 'student', text: 'University Student' },
            { value: 'peddler', text: 'Peddler' },
            { value: 'smith', text: 'Smith' },
            { value: 'poacher', text: 'Poacher' },
        ]
    })
    const adulthood = ref(adulthoodOptions.value[0].value)
    watch(sex, (newValue, oldValue) => {
        if (newValue === oldValue)
            return

        if (newValue === 'm' && adulthood.value === 'ladyInWaiting') {
            adulthood.value = 'squire'
        }
        else if (newValue === 'f' && adulthood.value === 'squire') {
            adulthood.value = 'ladyInWaiting'
        }
    })
    const adventuringReasonOptions = [
        { value: 'revenge', text: 'Revenge' },
        { value: 'loss', text: 'Loss' },
        { value: 'wanderlust', text: 'Wanderlust' },
        { value: 'forcedOut', text: 'ForcedOut' },
        { value: 'money', text: 'Money' },
    ]
    const adventuringReason = ref(adventuringReasonOptions[0].value)

    const initialAttributePoints = ref(4)
    const strength = ref(0)
    const agility = ref(0)
    const intelligence = ref(0)
    const charisma = ref(0)

    const initialSkillPoints = computed(() => intelligence.value)
    const ironflesh = ref(0)
    const powerStrike = ref(0)
    const powerThrow = ref(0)
    const powerDraw = ref(0)
    const weaponMaster = ref(0)
    const shield = ref(0)
    const athletics = ref(0)
    const riding = ref(0)
    const horseArchery = ref(0)
    const looting = ref(0)
    const trainer = ref(0)
    const tracking = ref(0)
    const tactics = ref(0)
    const pathfinding = ref(0)
    const spotting = ref(0)
    const inventoryManagement = ref(0)
    const woundTreatment = ref(0)
    const surgery = ref(0)
    const firstAid = ref(0)
    const engineer = ref(0)
    const persuasion = ref(0)
    const prisonerManagement = ref(0)
    const leadership = ref(0)
    const trade = ref(0)

    function computeBackground(){
        const modifiers = []
        if (sex.value === 'm')
            modifiers.push(SexMale)
        else
            modifiers.push(SexFemale)
        
        if (father.value === 'noble')
            modifiers.push(sex.value === 'm' ? FatherNobleMale : FatherNobleFemale)
        else if (father.value === 'merchant')
            modifiers.push(FatherMerchant)
        else if (father.value === 'warrior')
            modifiers.push(FatherWarrior)
        else if (father.value === 'hunter')
            modifiers.push(FatherHunter)
        else if (father.value === 'nomad')
            modifiers.push(sex.value === 'm' ? FatherNomadMale : FatherNomadFemale)
        else if (father.value === 'thief')
            modifiers.push(FatherThief)
        
        if (childhood.value === 'page')
            modifiers.push(ChildhoodPage)
        else if (childhood.value === 'craftsman')
            modifiers.push(ChildhoodCraftsmanApprentice)
        else if (childhood.value === 'shopAssitant')
            modifiers.push(ChildhoodShopAssistant)
        else if (childhood.value === 'urchin')
            modifiers.push(ChildhoodUrchin)
        else if (childhood.value === 'steppeChild')
            modifiers.push(ChildhoodSteppeChild)
        
        if (adulthood.value === 'squire')
            modifiers.push(AdulthoodSquire)
        else if (adulthood.value === 'ladyInWaiting')
            modifiers.push(AdulthoodLadyInWaiting)
        else if (adulthood.value === 'troubadour')
            modifiers.push(AdulthoodTroubadour)
        else if (adulthood.value === 'student')
            modifiers.push(AdulthoodStudent)
        else if (adulthood.value === 'peddler')
            modifiers.push(AdulthoodPeddler)
        else if (adulthood.value === 'smith')
            modifiers.push(AdulthoodSmith)
        else if (adulthood.value === 'poacher')
            modifiers.push(AdulthoodPoacher)
        
        if (adventuringReason.value === 'revenge')
            modifiers.push(ReasonRevenge)
        else if (adventuringReason.value === 'loss')
            modifiers.push(ReasonLoss)
        else if (adventuringReason.value === 'wanderlust')
            modifiers.push(ReasonWanderlust)
        else if (adventuringReason.value === 'forcedOut')
            modifiers.push(ReasonForcedOut)
        else if (adventuringReason.value === 'money')
            modifiers.push(ReasonMoney)

        const character = createCharacter(modifiers)
        initialAttributePoints.value = 4
        strength.value = character.strength
        agility.value = character.agility
        intelligence.value = character.intelligence
        charisma.value = character.charisma
    
        initialSkillPoints.value = 4
        ironflesh.value = character.ironflesh
        powerStrike.value = character.powerStrike
        powerThrow.value = character.powerThrow
        powerDraw.value = character.powerDraw
        weaponMaster.value = character.weaponMaster
        shield.value = character.shield
        athletics.value = character.athletics
        riding.value = character.riding
        horseArchery.value = character.horseArchery
        looting.value = character.looting
        trainer.value = character.trainer
        tracking.value = character.tracking
        tactics.value = character.tactics
        pathfinding.value = character.pathfinding
        spotting.value = character.spotting
        inventoryManagement.value = character.inventoryManagement
        woundTreatment.value = character.woundTreatment
        surgery.value = character.surgery
        firstAid.value = character.firstAid
        engineer.value = character.engineer
        persuasion.value = character.persuasion
        prisonerManagement.value = character.prisonerManagement
        leadership.value = character.leadership
        trade.value = character.trade
    }

    watch(
        [sex, father, childhood, adulthood, adventuringReason]
        , computeBackground
        , { immediate: true }
    )

    return {
        sex,
        sexOptions,
        father,
        fatherOptions,
        childhood,
        childhoodOptions,
        adulthood,
        adulthoodOptions,
        adventuringReason,
        adventuringReasonOptions,
        initialAttributePoints,
        strength,
        agility,
        intelligence,
        charisma,
        initialSkillPoints,
        ironflesh,
        powerStrike,
        powerThrow,
        powerDraw,
        weaponMaster,
        shield,
        athletics,
        riding,
        horseArchery,
        looting,
        trainer,
        tracking,
        tactics,
        pathfinding,
        spotting,
        inventoryManagement,
        woundTreatment,
        surgery,
        firstAid,
        engineer,
        persuasion,
        prisonerManagement,
        leadership,
        trade,
        computeBackground,
    }
}

const BaseCharacter = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'agility', Value: 1 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [
        { Type: 'riding', Value: 1 },
        { Type: 'leadership', Value: 1 },
    ],
}

const SexMale = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [],
}

const SexFemale = {
    Attributes: [
        { Type: 'agility', Value: 1 },
        { Type: 'intelligence', Value: 1 },
    ],
    Skills: [],
}

const FatherNobleMale = {
    Attributes: [
        { Type: 'intelligence', Value: 1 },
        { Type: 'charisma', Value: 2 },
    ],
    Skills: [
        { Type: 'riding', Value: 1 },
        { Type: 'leadership', Value: 1 },
        { Type: 'powerStrike', Value: 1 },
        { Type: 'weaponMaster', Value: 1 },
        { Type: 'tactics', Value: 1 },
    ],
}

const FatherNobleFemale = {
    Attributes: [
        { Type: 'intelligence', Value: 2 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [
        { Type: 'riding', Value: 2 },
        { Type: 'leadership', Value: 1 },
        { Type: 'woundTreatment', Value: 1 },
        { Type: 'firstAid', Value: 1 },
    ],
}

const FatherMerchant = {
    Attributes: [
        { Type: 'intelligence', Value: 2 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [
        { Type: 'riding', Value: 1 },
        { Type: 'inventoryManagement', Value: 1 },
        { Type: 'leadership', Value: 1 },
        { Type: 'trade', Value: 2 },
    ],
}

const FatherWarrior = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'agility', Value: 1 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [
        { Type: 'ironflesh', Value: 1 },
        { Type: 'powerStrike', Value: 1 },
        { Type: 'weaponMaster', Value: 1 },
        { Type: 'trainer', Value: 1 },
        { Type: 'leadership', Value: 1 },
    ],
}

const FatherHunter = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'agility', Value: 2 },
    ],
    Skills: [
        { Type: 'powerDraw', Value: 1 },
        { Type: 'athletics', Value: 1 },
        { Type: 'tracking', Value: 1 },
        { Type: 'pathfinding', Value: 1 },
        { Type: 'spotting', Value: 1 },
    ],
}

const FatherNomadMale = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'agility', Value: 1 },
        { Type: 'intelligence', Value: 1 },
    ],
    Skills: [
        { Type: 'riding', Value: 2 },
        { Type: 'pathfinding', Value: 1 },
        { Type: 'powerDraw', Value: 1 },
        { Type: 'horseArchery', Value: 1 },
    ],
}

const FatherNomadFemale = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'agility', Value: 1 },
        { Type: 'intelligence', Value: 1 },
    ],
    Skills: [
        { Type: 'riding', Value: 2 },
        { Type: 'pathfinding', Value: 1 },
        { Type: 'woundTreatment', Value: 1 },
        { Type: 'firstAid', Value: 1 },
    ],
}

const FatherThief = {
    Attributes: [
        { Type: 'agility', Value: 3 },
    ],
    Skills: [
        { Type: 'powerThrow', Value: 1 },
        { Type: 'athletics', Value: 2 },
        { Type: 'looting', Value: 1 },
        { Type: 'inventoryManagement', Value: 1 },
    ],
}

const ChildhoodPage = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [
        { Type: 'powerStrike', Value: 1 },
        { Type: 'persuasion', Value: 1 },
    ],
}

const ChildhoodCraftsmanApprentice = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'intelligence', Value: 1 },
    ],
    Skills: [
        { Type: 'engineer', Value: 1 },
        { Type: 'trade', Value: 1 },
    ],
}

const ChildhoodShopAssistant = {
    Attributes: [
        { Type: 'intelligence', Value: 1 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [
        { Type: 'inventoryManagement', Value: 1 },
        { Type: 'trade', Value: 1 },
    ],
}

const ChildhoodUrchin = {
    Attributes: [
        { Type: 'agility', Value: 1 },
        { Type: 'intelligence', Value: 1 },
    ],
    Skills: [
        { Type: 'looting', Value: 1 },
        { Type: 'spotting', Value: 1 },
    ],
}

const ChildhoodSteppeChild = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'agility', Value: 1 },
    ],
    Skills: [
        { Type: 'powerThrow', Value: 1 },
        { Type: 'horseArchery', Value: 1 },
    ],
}

const AdulthoodSquire = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'agility', Value: 1 },
    ],
    Skills: [
        { Type: 'powerStrike', Value: 1 },
        { Type: 'weaponMaster', Value: 1 },
        { Type: 'riding', Value: 1 },
        { Type: 'leadership', Value: 1 },
    ],
}

const AdulthoodLadyInWaiting = {
    Attributes: [
        { Type: 'intelligence', Value: 1 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [
        { Type: 'riding', Value: 1 },
        { Type: 'woundTreatment', Value: 1 },
        { Type: 'persuasion', Value: 2 },
    ],
}

const AdulthoodTroubadour = {
    Attributes: [
        { Type: 'charisma', Value: 2 },
    ],
    Skills: [
        { Type: 'weaponMaster', Value: 1 },
        { Type: 'pathfinding', Value: 1 },
        { Type: 'persuasion', Value: 1 },
        { Type: 'leadership', Value: 1 },
    ],
}

const AdulthoodStudent = {
    Attributes: [
        { Type: 'intelligence', Value: 2 },
    ],
    Skills: [
        { Type: 'weaponMaster', Value: 1 },
        { Type: 'woundTreatment', Value: 1 },
        { Type: 'surgery', Value: 1 },
        { Type: 'persuasion', Value: 1 },
    ],
}

const AdulthoodPeddler = {
    Attributes: [
        { Type: 'intelligence', Value: 1 },
        { Type: 'charisma', Value: 1 },
    ],
    Skills: [
        { Type: 'riding', Value: 1 },
        { Type: 'pathfinding', Value: 1 },
        { Type: 'inventoryManagement', Value: 1 },
        { Type: 'trade', Value: 1 },
    ],
}

const AdulthoodSmith = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'intelligence', Value: 1 },
    ],
    Skills: [
        { Type: 'weaponMaster', Value: 1 },
        { Type: 'tactics', Value: 1 },
        { Type: 'engineer', Value: 1 },
        { Type: 'trade', Value: 1 },
    ],
}

const AdulthoodPoacher = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'agility', Value: 1 },
    ],
    Skills: [
        { Type: 'powerDraw', Value: 1 },
        { Type: 'athletics', Value: 1 },
        { Type: 'tracking', Value: 1 },
        { Type: 'spotting', Value: 1 },
    ],
}

const ReasonRevenge = {
    Attributes: [
        { Type: 'strength', Value: 2 },
    ],
    Skills: [
        { Type: 'powerStrike', Value: 1 },
    ],
}

const ReasonLoss = {
    Attributes: [
        { Type: 'charisma', Value: 2 },
    ],
    Skills: [
        { Type: 'ironflesh', Value: 1 },
    ],
}

const ReasonWanderlust = {
    Attributes: [
        { Type: 'agility', Value: 2 },
    ],
    Skills: [
        { Type: 'pathfinding', Value: 1 },
    ],
}

const ReasonForcedOut = {
    Attributes: [
        { Type: 'strength', Value: 1 },
        { Type: 'intelligence', Value: 1 },
    ],
    Skills: [
        { Type: 'weaponMaster', Value: 1 },
    ],
}

const ReasonMoney = {
    Attributes: [
        { Type: 'agility', Value: 1 },
        { Type: 'intelligence', Value: 1 },
    ],
    Skills: [
        { Type: 'looting', Value: 1 },
    ],
}

export function createCharacter(setup) {
    const playerTemplate = troops.value[0]
    const player = {...playerTemplate.attributes, ...playerTemplate.skills}

    addModifierSet(BaseCharacter)
    for (const modifierSet of setup)
        addModifierSet(modifierSet)

    return player

    function addModifierSet(modifierSet) {
        for (const modifier of modifierSet.Attributes)
            addAttribute(modifier)
        for (const modifier of modifierSet.Skills)
            addSkill(modifier)

        function addAttribute(modifier) {
            player[modifier.Type] += modifier.Value
        }
        function addSkill(modifier) {
            player[modifier.Type] += modifier.Value
        }
    }
}