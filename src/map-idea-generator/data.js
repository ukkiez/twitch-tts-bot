const categories = [
  // includes difficulty, but also adjectives like "simple"
  "main_type",

  // should include if it's virtual or not
  "visual_theme",

  // maybe only in case of virtual; possibly multiple colours can be combined at
  // random; we could even go as far as to give specific colours for e.g. dust,
  // spikes, tiles, enemies, the player, etc.
  "colour_scheme",

  "gameplay_theme",
  // can be techniques, or something like dustblocks
  "feature",

  "enemy",

  // description of thing, e.g. big or small
  "descriptor",

  // number of "things", e.g. many or some
  "amount",

  // setting / backstory
  "literary_theme",

  // e.g. no dash, directionless, low%, character-specific; should not occur
  // often
  "restriction",
];

const templates = [
  "A @main_type @gameplay_theme map, featuring @feature, with a @visual_theme theme.",
  "A @main_type @gameplay_theme map, featuring @feature and @descriptor @enemy, with a @visual_theme theme.",
  "A @main_type @gameplay_theme map, featuring @feature and @amount @enemy, with a @visual_theme theme.",
  "A @main_type map, featuring @feature, @feature, and @amount @feature, with a @visual_theme theme.",
  "A @main_type @visual_theme map, featuring @amount @feature and @amount @feature.",
  "A @main_type @visual_theme map about @literary_theme, with @restriction and @restriction.",
  "A @main_type map, featuring @amount @feature, @amount @feature, and @amount @feature.",
  "A @main_type map, featuring @amount @enemy, @enemy, and @amount @enemy.",
  "A @main_type map, featuring @enemy, @descriptor @enemy, @enemy, and @amount @enemy.",

  "A @visual_theme map about @literary_theme, featuring @amount @descriptor @enemy, with @restriction",

  "A @visual_theme map with @descriptor @enemy, with @restriction.",
  "A @visual_theme map with @descriptor @enemy and @amount @feature, with @restriction.",
  "A @visual_theme map with @amount @descriptor @enemy, with @restriction.",
  "A @visual_theme map, featuring @feature and @descriptor @enemy, with @restriction.",

  "A @visual_theme map with a @colour_scheme colour theme, with @restriction.",
  "A @visual_theme map about @literary_theme, with @restriction and @restriction.",

  "A @main_type @gameplay_theme map, with only @enemy.",
  "A @gameplay_theme map, with only @feature.",

  "A map featuring only @descriptor @enemy.",

  "A virtual map with a @colour_scheme and @colour_scheme colour scheme, featuring @feature and @amount @enemy.",
  "A virtual @gameplay_theme map with a @colour_scheme and @colour_scheme colour scheme, featuring @feature and @feature.",
];

/*
  SYNTAX LEGEND

  @ category
  # marker
  ; singular form
  / alternatives, to be picked at random

*/

const data = `
------------------------------ MAIN TYPE ------------------------------
#main_type
simple
stupid
shit
casual
easy
medium
hard
impossibly difficult
slow
fast-paced
very fast-paced
#end

------------------------------ VISUALS ------------------------------
#visual_theme
forest
mansion
city
lab
virtual
non-virtual
#end

------------------------------ COLOURS ------------------------------
#colour_scheme
red
blue
green
yellow
purple
pink
orange
brown
black
white
gray
gold
silver
navy blue
sky blue
lime green
teal
indigo
magenta
violet
khaki
salmon
crimson
lavender
plum
blue violet
olive
cyan
maroon
beige
#end

------------------------------ GAMEPLAY ------------------------------
#gameplay_theme
boosting
climbing
falling
apple juggling
low%
precision platforming
air control
out of bounds%
unload%
minecraft%
spike maze
open route
pacifist
backtracking
altered physics
super farming
damage farming
enemy juggling
#end

------------------------------ FEATURES ------------------------------
#feature
corner boosts
thud boosts
slope boosts
slant boosts
low boosts
fit boosts
access boosts
ADBs
sock boosts
apartments boosts
security boosts
damage boosts
zips
updashes
jorfs
setup jorfs
slant jorfs
wall jorfs
jorf boosts
deadlegs
buffered wallruns
spike jumps
spike stands
tera drops
tera climbs
half-tera climbs
ledge cancels
mantles
corner cuddles
mapler slides
v-ceilings
ECSs (Extended Ceiling Slides)
dash jumps
itay dashes
taildashes
slope reversals
seam heavies
heavy downdashes
super drops
helicopter lights
back heavies
wall cancels
heavy cancels
orphan attacks
slant twirlies
twirlies
infinite walljumps
droofs
dynos
invisible wall jumps
super reversals
ceiling bonks
ledge clips
clips
empty supers
dustblocks
nelsons
death warps
redirecting of porcupine quills
blind drops
boosts into spikes
#end

------------------------------ ENEMIES ------------------------------
#enemy
apples
bears
books
butlers
scroll chests
treasure chests
keys
flag enemies
big gargoyles
small gargoyles
hawks
knights
maids
porcupines
small prisms
heavy prisms
scrolls
slime blobs
slime barrels
slime bears
spring blobs
stonebosses
stonebros
trash turkeys
trash beasts
trash cans
tires
wolves
#end

------------------------------ DESCRIPTORS ------------------------------
#descriptor
invisible
gigantic
big
medium-sized
small
tiny
slow-moving
fast-moving
very fast-moving
#end

------------------------------ AMOUNTS ------------------------------
#amount
some
a couple
a few
several
many
a lot of
3
5
69
#end

------------------------------ LITERARY THEMES ------------------------------
#literary_theme
adversity
america
birds
childhood
courage
deception
destiny
depression
dreams
earth
emotions
volcanoes
water
faith
fate
fear
flowers
forgiveness
freedom
friendship
god
gratitude
grief
happiness
hate
heartbreak
heaven
hope
imagination
inner peace
inspiration
jealousy
joy
the purpose of life
the meaning of life
love
marriage
memories
mountains
music
nature
new year
not giving up
overcoming adversity
pain
patience
peace
positivity
prayer
regret
revenge
roses
sadness
sin
soul
space
stars
suffering
sympathy
time
trees
trust
unconditional love
war
work
#end

------------------------------ RESTRICTIONS ------------------------------
#restriction
no dashing
no jumping
no attacking
disabled super
only 1-tile blocks
only slopes
only walls
only slants
no dying
no checkpoints
no floors
a terrible custom music track
default camera
a very zoomed-in camera
a very zoomed-out camera
#end
`;

const dataByCategory = {};
for ( const category of categories ) {
  const list = data.split( `#${ category }\n` )[ 1 ].split( "\n#end" )[ 0 ].split( "\n" );

  dataByCategory[ `@${ category }` ] = list;
}

module.exports = {
  templates,
  dataByCategory,
};
