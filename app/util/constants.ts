/** SpellIds to blacklist */
export const ABILITY_BLACKLIST: number[] = [
  98021, // Spirit link totem
  201657, // Earthen Wall Totem
  425610, // Empowering Flame
];

/** SpellIds that don't scale with buffs */
export const ABILITY_NO_SCALING: number[] = [
  404908, // Fate Mirror
  410265, // Infernos Blessing
  409632, // Breath of Eons
  360828, // Blistering Scales
];

/** SpellIds for abilities that scale off armor/HP */
export const ABILITY_NO_SHIFTING_SCALING: number[] = [
  322109, // Touch of Death
  400223, // Thorns of Iron
  124280, // Touch of Karma
];

/** SpellIds that don't attribute to Breath of Eons ie. non class abilities */
export const ABILITY_NO_BOE_SCALING: number[] = [
  281721, // Bile-Stained Crawg Tusks (Vile Bile)
  214397, // Mark of Dargrul (Landslide)
  259756, // Entropic Embrace
  214350, // Nightmare Essence
  215444, // Dark Blast
  215407, // Dark Blast
  214168, // Brutal Haymaker
  214169, // Brutal Haymaker
  228784, // Brutal Haymaker Vulnerability
  213785, // Nightfall
  243991, // Blazefury Medallion
  370816, // Shocking Disclosure,
  370817, // Shocking Disclosure,
  370880, // Awakened Rime,
  371024, // Elemental Potion of Power,
  371028, // Elemental Potion of Ultimate Power,
  371039, // Potion of Withering Vitality,
  371052, // Potion of Chilled Clarity,
  371055, // Delicate Suspension of Spores,
  371070, // Rotting from Within,
  371087, // Restorative Spores,
  371124, // Invisible,
  371125, // Potion of the Hushed Zephyr,
  371133, // Potion of the Hushed Zephyr,
  371134, // Potion of the Hushed Zephyr,
  371149, // Potion of Chilled Clarity,
  371151, // Potion of Chilled Clarity,
  371152, // Potion of Chilled Clarity,
  371515, // Potion Cauldron of Power,
  371519, // Potion Cauldron of Power,
  371521, // Potion Cauldron of Power,
  371622, // Residual Neural Channeling Agent,
  371850, // Potion of Withering Vitality,
  371911, // Infurious Vengeance,
  371991, // Bottled Putrescence,
  371993, // Bottled Putrescence,
  372046, // Bottled Putrescence,
  374037, // Overwhelming Rage,
  374087, // Glacial Fury,
  374249, // Chill of the Depths,
  374250, // Chill of the Depths,
  375218, // Choker of Shielding,
  375273, // Earthen Ward,
  375276, // Earthen Ward,
  375285, // Choker of Shielding,
  375497, // Enchanted Winds,
  375607, // Seething Blue Magic,
  375684, // Searing Magic,
  375685, // Earthbreaker,
  375686, // Shockwave,
  376241, // Chain Lightning,
  376600, // Arcanobomb,
  376932, // Magic Snowball,
  377079, // Flaring Cowl,
  377087, // Full Belly,
  377420, // Searing Blue Flame,
  377451, // Conjured Chillglobe,
  377455, // Iceblood Deathsnare,
  377464, // Desperate Invocation,
  377546, // Red Magic Infusion,
  377781, // Time Compression,
  377874, // Earth Shield,
  377875, // Earth Shield,
  378019, // Arcane Barrier,
  378393, // Tome-Wrought Rot,
  378426, // Corrosive Slime,
  378462, // Worldbreaker's Boon,
  378735, // Titan Bolt,
  379395, // Launched Thorns,
  379403, // Launched Thorns,
  379405, // Launched Thorns,
  379407, // Launched Thorns,
  379420, // Magma Shield,
  379983, // Piercing Barb,
  379986, // Piercing Barb,
  381006, // Deep Chill,
  381304, // Waters of the Falls,
  381312, // Waters of the Falls,
  381475, // Erupting Spear Fragment,
  381654, // Tip of the Spear,
  381700, // Forgestorm Ignited,
  381760, // Mutated Tentacle Slam,
  381824, // Conjured Chillglobe,
  381924, // Zapthrottle Soul Inhaler,
  381967, // Way of Controlled Currents,
  382090, // Storm-Eater's Boon,
  382097, // Rumbling Ruby,
  382130, // Crystalline Web,
  382131, // Iceblood Deathsnare,
  382135, // Manic Grieftorch,
  382139, // Homeland Raid Horn,
  382426, // Spiteful Stormbolt,
  383612, // RIP SPINE,
  383675, // Azerite Grenade,
  383761, // Unleashed Lifeflame,
  383814, // Lobbing Fire Nova,
  384003, // Dwarven Barrage,
  384004, // Dwarven Barrage,
  384044, // Supercollide-O-Tron,
  384071, // I.W.I.N. Button Mk10,
  384081, // Plane Displacer,
  384098, // Alarm-O-Turret,
  384114, // Precision Blast,
  384117, // Stormslash,
  384141, // Grease Grenade,
  384177, // Strike Twice,
  384290, // Smorf's Ambush,
  384434, // Primal Deconstruction Charge,
  384496, // Gravitational Displacer,
  384516, // Gravitational Displacer,
  384519, // Gravitational Displacer,
  384532, // Watcher's Blessing,
  384560, // Watcher's Blessing,
  384584, // Deathly Gusts,
  384613, // Refreshing Dance,
  384615, // Refreshing Dance,
  384624, // Refreshing Dance,
  384639, // Trampling Hooves Speed Zone,
  384735, // Supercollide-O-Tron,
  384893, // Convincingly Realistic Jumper Cables,
  384895, // Convincingly Realistic Jumper Cables,
  384902, // Convincingly Realistic Jumper Cables,
  384903, // Convincingly Realistic Jumper Cables,
  385330, // Chirping Rune,
  385403, // Arclight Vital Correctors,
  385404, // Arclight Vital Correctors,
  385519, // Breath of Neltharion,
  385533, // Trampling Hooves,
  385581, // Chirping Rune,
  385582, // Chirping Rune,
  385583, // Chirping Rune,
  385804, // Hunting Bow,
  385903, // Crystal Sickness,
  386175, // Idol of Trampling Hooves,
  386271, // Completely Safe Rocket Missile,
  386296, // Completely Safe Rocket Blast,
  386297, // Completely Safe Rocket Blast,
  386298, // Completely Safe Rocket Missile,
  386301, // Completely Safe Rocket Blast,
  386302, // Completely Safe Rocket Missile,
  386324, // Endless Stack of Needles,
  386365, // Endless Stack of Needles,
  386367, // Endless Stack of Needles,
  386523, // EZ-Thro Primal Deconstruction Charge,
  386584, // EZ-Thro Gravitational Displacer,
  386587, // EZ-Thro Gravitational Displacer,
  386589, // EZ-Thro Gravitational Displacer,
  386623, // Awakening Rime,
  386624, // Awakening Rime,
  386625, // Cold Sleet,
  386708, // Dragon Games Equipment,
  386709, // Dragon Games Equipment,
  387112, // Arcane Storm,
  387143, // Amice of the Blue,
  387903, // EZ-Thro Grease Grenade,
  388081, // Bronzed Grip Wrappings,
  388083, // Bronzed Grip Wrappings,
  388739, // Pure Decay,
  388755, // Soulseeker Arrow,
  388855, // Miniature Singing Stone,
  388881, // Miniature Singing Stone,
  388948, // Breaking the Ice,
  389097, // Arcing Blast,
  389148, // Blazing Torment,
  389176, // Blazing Soul,
  389178, // Blazing Speed,
  389710, // Burnout Wave,
  389816, // Fire Shot,
  389817, // Curing Whiff,
  389839, // Fire Shot,
  390234, // Lobbing Fire Nova,
  390350, // Frozen Devotion,
  390497, // Torrent Caller's Shell,
  390838, // Primal Turtle's Rage,
  390896, // Curing Whiff,
  390941, // Mending Breath,
  391213, // Hunting Bow,
  391214, // Hunting Bow,
  391216, // Hunting Bow,
  391621, // Ancient Poison Cloud,
  392038, // Spark of the Primals,
  392127, // Thunderstruck,
  392343, // Ohn Lite Drinking,
  392359, // Cataclysmic Punch,
  392376, // Cataclysmic Punch,
  392612, // Grease Grenade,
  392613, // Grease Grenade,
  392614, // EZ-Thro Grease Grenade,
  392615, // EZ-Thro Grease Grenade,
  393795, // Arclight Vital Correctors,
  393935, // Pure Decay,
  394323, // Clearing Charge,
  394453, // Broodkeeper's Blaze,
  394618, // Crystalline Web,
  395175, // Treemouth's Festering Splinter,
  395729, // Arclight Cannon,
  396050, // Freezing,
  396142, // Chirping Rune,
  396143, // Chirping Rune,
  396144, // Chirping Rune,
  396147, // Chirping Rune,
  396148, // Chirping Rune,
  396411, // Primal Overload,
  397036, // Aligning Matter,
  397039, // Arcane Bubble,
  397041, // Corporeal Tear,
  397401, // Fetid Breath,
  397405, // Diamond Deathsnare,
  397622, // Arcanosphere,
  397623, // Arcanosphere,
  397624, // Arcanosphere,
  397638, // Shockwave,
  397639, // Earthbreaker,
  397640, // Shockwave,
  397641, // Earthbreaker,
  397642, // Shockwave,
  397643, // Earthbreaker,
  397653, // Arcane Storm,
  397655, // Arcane Storm,
  397657, // Arcane Storm,
  398320, // Winterpelt's Fury,
  398722, // Snowdrift,
  398734, // Snowdrift,
  398736, // Snowdrift,
  398738, // Snowdrift,
  400796, // Caber Toss,
  400956, // Impaling Grapnel,
  400959, // Furious Impact,
  401187, // Molten Overflow,
  401238, // Writhing Ward,
  401306, // Anvil Strike,
  401324, // Echoed Flare,
  401394, // Unstable Flames,
  401422, // Shadow Spike,
  401428, // Ravenous Shadowflame,
  401753, // Molten Boulder,
  402434, // Molten Boulder,
  402440, // Molten Boulder,
  402447, // Molten Boulder,
  402583, // An'shuul, the Cosmic Wanderer,
  403087, // Storm Infused Stone,
  403171, // Uncontainable Charge,
  403225, // Flame Licked Stone,
  403232, // Raging Magma Stone,
  403253, // Raging Magma Stone,
  403257, // Searing Smokey Stone,
  403336, // Indomitable Earth Stone,
  403376, // Gleaming Iron Stone,
  403381, // Deluging Water Stone,
  403391, // Freezing Ice Stone,
  403392, // Cold Frost Stone,
  403393, // Cold Frost Stone,
  403408, // Exuding Steam Stone,
  403503, // Sparkling Mana Stone,
  404911, // Desirous Blood Stone,
  404941, // Shining Obsidian Stone,
  405001, // Gleaming Iron Stone,
  405064, // Darkened Elemental Core,
  405068, // Cauterizing Flame,
  405167, // Darkened Elemental Core Explosion,
  405209, // Humming Arcane Stone,
  405220, // Pestilent Plague Stone,
  405221, // Pestilent Plague Stone,
  405235, // Wild Spirit Stone,
  405639, // Azure Scrying Crystal,
  405940, // Seething Descent,
  406251, // Roiling Shadowflame,
  406448, // Satchel of Healing Spores,
  406488, // Angry Friend,
  406744, // Sulfuric Burning,
  406747, // Suspended Sulfuric Droplet,
  406764, // Shadowflame Wreathe,
  406770, // Shadowflame Wreathe,
  406793, // Sporeadic Adaptability,
  406906, // Polarity Bomb,
  406963, // Prepare Potion Cauldron of Ultimate Power,
  406964, // Prepare Potion Cauldron of Ultimate Power,
  406965, // Prepare Potion Cauldron of Ultimate Power,
  407013, // Not Edible,
  407020, // EZ-Thro Polarity Bomb,
  407090, // Ever-Decaying Spores,
  407092, // Immediately Decaying Spores,
  407512, // Heatbound Release,
  407537, // Firecaller's Explosion,
  407896, // Drogbar Rocks,
  407907, // Drogbar Stones,
  407961, // Lava Wave,
  407982, // Hot Lava,
  408015, // Shadowflame Rocket Blast,
  408469, // Call to Suffering,
  408578, // Anvil Strike,
  408625, // Fractured Crystalspine Quill,
  408635, // Molten Pour,
  408682, // Dragonfire Bomb Dispenser,
  408694, // Dragonfire Bomb Dispenser,
  408711, // Shadowed Razing Annihilator,
  408791, // Ashkandur, Fall of the Brotherhood,
  408815, // Djaruun, Pillar of the Elder Flame,
  408832, // Djaruun, Pillar of the Elder Flame,
  408836, // Djaruun, Pillar of the Elder Flame,
  408903, // Fractured Crystalspine Quill,
  409067, // Stirring Twilight Ember,
  409309, // Deepflayer Lure,
  410228, // Shadowed Impact Buckler,
  411024, // Shadowed Razing Annihilator,
  411594, // Shadowed Razing Annihilator,
  413423, // Thunderous Pulse,
  413584, // Explosive Rage,
  414532, // Mark of Fyr'alath,
  414864, // Sulfuras Smash,
  414865, // Sulfuras Crash,
  414866, // Sulfuras Blast,
  414935, // Doomstrike,
  414936, // Warstrikes,
  414951, // Warstrikes,
  414977, // Fires of Azzinoth,
  415033, // Lich Form,
  415052, // Lich Touch,
  415132, // Lich Frost,
  415133, // Lich Form,
  415170, // Lich Form,
  415200, // Direct Order - 'End It',
  415339, // Tideseeker's Cataclysm,
  415395, // Tideseeker's Cataclysm,
  415412, // Tideseeker's Thunder,
  417134, // Rage of Fyr'alath,
  417458, // Accelerating Sandglass,
  417468, // Fires of Azzinoth,
  418080, // Echoing Tyrstone,
  418588, // Sand Cleave,
  418605, // Sand Bolt,
  419052, // Restorative Sands,
  419262, // Warchief's Rend,
  419268, // Lion's Light,
  419278, // Extinction Blast,
  419279, // Extinction Blast,
  419423, // Infinite Domain,
  419539, // Lich Shield,
  419591, // Auto Attack,
  419737, // Timestrike,
  420144, // Timestrike,
  420762, // Dreamtender's Pollen,
  421996, // Ursine Reprisal,
  422146, // Solar Maelstrom,
  422303, // Embed Blade,
  422750, // Shadowflame Rage,
  422956, // Nymue's Unraveling Spindle,
  423414, // Potion of Withering Dreams,
  423416, // Potion of Withering Dreams,
  423880, // Spring's Keeper,
  423902, // Winter's Stand,
  423903, // Winter's Stand,
  423923, // Fang of the Frenzied Nightclaw,
  423932, // Moragh's Favorite Rock,
  424075, // Fystia's Fiery Kris,
  424107, // Root of Fire,
  424141, // Ori's Verdant Feather,
  424173, // Rune of the Umbramane,
  424213, // Spear of the Wilds,
  424214, // Spear of the Wilds,
  424324, // Hungering Shadowflame,
  424846, // Dream Eater,
  424965, // Thorn Spirit,
  425154, // Vicious Brand,
  425156, // Radiating Brand,
  425177, // Thorncaller Claw,
  425180, // Vicious Brand,
  425181, // Thorn Burst,
  425417, // Solar Maelstrom,
  425461, // Tainted Heart,
  425509, // Severed Embers,
  425571, // Wall of Hate,
  425664, // Shadowflame Lash Missile,
  425701, // Shadowflame Lash,
  425703, // Shadowflame Rage,
  426114, // Twisted Blade,
  426306, // Blazing Rage,
  426431, // Denizen of the Flame,
  426474, // Verdant Tether,
  426486, // Denizen of the Flame,
  426527, // Flaying Torment,
  426534, // Flaying Torment,
  426535, // Scorching Torment,
  426564, // Annihilating Flame,
  426748, // Thundering Orb,
  426834, // Lava Bolt,
  426950, // Fan the Flames,
  426951, // Searing Beak,
  427037, // Lava Bolt,
  427047, // Molten Rain,
  427059, // Lava Bolt,
  427161, // Essence Splice,
  427209, // Web of Dreams,
  427212, // Web of Dreams,
  427215, // Dream Shackles,
  428647, // Chill,
  428663, // Burn,
  428688, // Poison,
  428692, // Shock,
  428699, // Shock,
  429216, // Sunstrider's Flourish,
  429233, // Rezan's Fury,
  429252, // Mark of Arrogance,
  429412, // Victory Pyre,
  429604, // Hope's Flame,
  429617, // Fan the Flames,
  433522, // Crystal Sickness,
  433726, // Primal Wellspring Water,
  433734, // Purified Wellspring Water,
  433770, // Inexorable Defense,
  433772, // Inexorable Resonance,
  433829, // Wellspring's Frost,
  433830, // Shatter,
  433889, // Arcane Annihilation,
  434021, // Arcane Barrage,
  434218, // Purified Wellspring Water
];

/** SpellsIds that doesn't scale off mainstat but vers/crit */
export const ABILITY_NO_EM_SCALING: number[] = [
  ...ABILITY_NO_BOE_SCALING,
  ...ABILITY_NO_SHIFTING_SCALING,
  402583, // Beacon
  408682, // Dragonfire Bomb Dispenser
  408694, // Dragonfire Bomb Dispenser
  401324, // Pocket Anvil (Echoed Flare)
  401306, // Pocket Anvil (Anvil Strike)
  401422, // Vessel of Searing Shadow (Shadow Spike)
  401428, // Vessel of Searing Shadow (Ravenous Shadowflame)
  418774, // Mirror of Fractured Tomorrows ()
  418588, // Mirror of Fractured Tomorrows (Sand Cleave)
  419591, // Mirror of Fractured Tomorrows (Auto Attack)
  418607, // Mirror of Fractured Tomorrows (Sand Bolt)
  406251, // Roiling Shadowflame
  406889, // Roiling Shadowflame (Self Harm)
  379403, // Toxic Thorn Footwraps (Launched Thorns)
  408791, // Ashkandur, Fall of the Brotherhood
  378426, // Slimy Expulsion Boots boots (Corrosive Slime)
  381006, // Acidic Hailstone Treads (Deep Chill)
  381700, // Forgestorm (Forgestorm Ignited)
  406764, // Shadowflame Wreathe
  394453, // Broodkeeper's Blaze
  370794, // Unstable Frostfire Belt (Lingering Frostspark)
  408836, // Djaruun, Pillar of the Elder Flame
  408815, // Djaruun, Pillar of the Elder Flame
  381475, // Erupting Spear Fragment
  281721, // Bile-Stained Crawg Tusks (Vile Bile)
  214397, // Mark of Dargrul (Landslide)
  408469, // Call to Suffering (Self Harm)
  374087, // Glacial Fury
  184689, // Shield of Vengeance
  322109, // Touch of Death
  400223, // Thorns of Iron
  124280, // Touch of Karma
  370817, // Shocking Disclosure
  426564, // Augury of the Primal Flame (Annihilating Flame)
  417458, // Accelerating Sandglass
  424965, // Thorn Spirit
  425181, // Thorn Blast
  419737, // Timestrike
  265953, // Touch of Gold
  425154, // Vicious Brand
  425156, // Radiating Brand
  422146, // Solar Maelstrom
  426341, // Tindral's Fowl Fantasia
  426431, // Denizen Of The Flame
  426486, // Denizen Of The Flame Final
  426339, // Igiras Cruel Nightmare
  426527, // Flaying Torment
  259756, // Entropic Embrace
  427209, // Web of Dreams
  422956, // Essence Splice
  424324, // Hungering Shadowflame
  419279, // Extinction Blast
  215444, // Dark Blast
  214168, // Brutal Haymaker
  214169, // Brutal Haymaker
  228784, // Brutal Haymaker Vulnerability
  214350, // Nightmare Essence
  422750, // Shadowflame Rage
  425701, // Shadowflame Lash Enemy
  422750, // Tainted Heart
  425461, // Tainted Heart Enemy Damage
  417458, // Accelerating Sandglass
  215407, // Dark Blast
  270827, // Webweavers Soul Gem
  386297, // Completely Safe Rocket Blast
  213785, // Nightfall
  425509, // Severed Embers (Branch of the Tormented Ancient)
  414532, // Mark of Fyr'alath (Fyr'alath the Dreamrender)
  417134, // Rage of Fyr'alath (Fyr'alath the Dreamrender)
  413584, // Explosive Rage (Fyr'alath the Dreamrender)
  424094, // Rage of Fyr'alath (Fyr'alath the Dreamrender)
  386301, // Completely Safe Rocket
  243991, // Blazefury Medallion
];

/** SpellsIds that don't appear to re-attribute properly.
 * Non-exhaustive list.
 */
export const ABILITY_BROKEN_ATTRIBUTION: number[] = [
  /* 388070, // Fel Barrage
  271971, // Dreadbite
  205196, // Dreadbite 2.0
  259756, // Entropic Embrace
  // 394021, // Mutilated Flesh
  91778, // Sweeping Claws
  91776, // Claw
  47632, // Death Coil
  390271, // Coil of Devastation
  10444, // Flametongue Attack
  83381, // Kill command
  426703, // Kill Command 2.0
  16827, // Claw
  75, // Auto Shot
  389448, // Kill Cleave
  386301, // Completely Safe Rocket Blast
  // 385638, // Razor Fragments
  118459, // Beast Cleave
  344572, // Bestial Wrath
  321538, // Bloodshed
  118459, // Beast Cleave
  // 409483, // Poisoned Edges
  // 201754, // Stomp
  116858, // Chaos Bolt (Prescience)
  425610, // Dumb boss spell
  428493, // Chaotic Disposition
  258922, // Immolation Aura
  258921, // Immolation Aura 2.0
  // 204598, // Sigil of Flame
  423193, // Sanguine Blades
  409483, // Poisoned Edges
  409605, // Soulreave
  409604, // Soulrip
  419800, // Intensifying Flame
  //351140, // Meteor
  12654, // Ignite
  408310, // Crashing Star
  394061, // Astral Smolder
  394047, // Goldrinn's Fang
  202497, // Shooting Stars
  191037, // Starfall
  164815, // Sunfire
  164812, // Moonfire
  384391, // Sidearm
  361500, // Living Flame
  359077, // Eternity Surge
  418588, // Mirror trinket (Sand Cleave)
  388009, // Blessing of Summer
  22482, // Blade Flurry */
];

export const SNAPSHOTTED_DOTS: number[] = [
  269576, // Master Marksman (BM)
];

export const mrtColorMap: Map<string, string> = new Map([
  ["Mage", "|cff3fc7eb"],
  ["Paladin", "|cfff48cba"],
  ["Warrior", "|cffc69b6d"],
  ["Druid", "|cffff7c0a"],
  ["DeathKnight", "|cffc41e3a"],
  ["Hunter", "|cffaad372"],
  ["Priest", "|cffffffff"],
  ["Rogue", "|cfffff468"],
  ["Shaman", "|cff0070dd"],
  ["Warlock", "|cff8788ee"],
  ["Monk", "|cff00ff98"],
  ["DemonHunter", "|cffa330c9"],
  ["Evoker", "|cff33937f"],
]);

export const EBON_MIGHT = 395152;
export const SHIFTING_SANDS = 413984;
export const PRESCIENCE = 410089;
export const COMBUSTION_BUFF = 190319;

/**
 * These values represent an estimation of about how much
 * these buffs provide to a players throughput
 * we use these values to attempt to combat abilities with
 * broken attribution, this is obviously not a perfect solution
 * but will help us with getting a more accurate idea of actual
 * throughput.
 */
export const EBON_MIGHT_CORRECTION_VALUE = 0.06;
export const SHIFTING_SANDS_CORRECTION_VALUE = 0.14;
export const PRESCIENCE_CORRECTION_VALUE = 0.025;
