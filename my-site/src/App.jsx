import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import imgBarbaraHepworthGarden from "./assets/images/BarbaraHepworthGarden.jpeg";
import imgBarbaraHepworthStudio from "./assets/images/BarbaraHepworthStudio.jpeg";
import imgBarbaraHepworthStudio2 from "./assets/images/BarbaraHepworthStudio2.jpeg";
import imgCafeMylor from "./assets/images/CafeMylor.jpeg";
import imgEdenProject from "./assets/images/EdenProject.jpeg";
import imgFishNTrips from "./assets/images/FishNTrips.jpeg";
import imgFishingOffRocks from "./assets/images/FishingOffRocks.jpeg";
import imgHarbour from "./assets/images/Harbour.jpeg";
import imgHiddenHut from "./assets/images/HiddenHut.jpeg";
import imgHiddenHutAerial from "./assets/images/HiddenHutAerial.jpeg";
import imgHiddenHutFeast from "./assets/images/HiddenHutFeast.jpeg";
import imgHiddenHutFeast2 from "./assets/images/HiddenHutFeast2.jpeg";
import imgHiddenHutfromBeach from "./assets/images/HiddenHutfromBeach.jpeg";
import imgHouse from "./assets/images/House.jpg";
import imgHouseEast from "./assets/images/HouseEast.jpeg";
import imgHouseFromRoad from "./assets/images/HouseFromRoad.jpeg";
import imgHouseNorth from "./assets/images/HouseNorth.jpeg";
import imgJuniorRaceWeek from "./assets/images/JuniorRaceWeek.jpeg";
import imgKitchenToBe from "./assets/images/KitchenToBe.jpeg";
import imgNareHead from "./assets/images/NareHead.jpeg";
import imgPorthcurnick from "./assets/images/Porthcurnick.jpeg";
import imgPorthcurnickPortcatho from "./assets/images/PorthcurnickPortcatho.jpeg";
import imgPorthcurnickPortcatho2 from "./assets/images/PorthcurnickPortcatho2.jpeg";
import imgPortscathoFromTheAir from "./assets/images/PortscathoFromTheAir.jpg";
import imgPortscathoHarbour from "./assets/images/PortscathoHarbour.jpeg";
import imgPortscathoHarbour2 from "./assets/images/PortscathoHarbour2.jpeg";
import imgPortscathoStores from "./assets/images/PortscathoStores.jpeg";
import imgPortscathofromtheAir2 from "./assets/images/PortscathofromtheAir2.JPG";
import imgPurchaseDay from "./assets/images/PurchaseDay.jpeg";
import imgRalphs from "./assets/images/Ralphs.jpeg";
import imgScathosScoops from "./assets/images/ScathosScoops.jpeg";
import imgShillakabookyBeachHut from "./assets/images/ShillakabookyBeachHut.jpeg";
import imgStIves from "./assets/images/StIves.jpeg";
import imgStMawesHarbour from "./assets/images/StMawesHarbour.jpeg";
import imgStMawesHarbour2 from "./assets/images/StMawesHarbour2.jpeg";
import imgStMawesHarbourWall from "./assets/images/StMawesHarbourWall.jpeg";
import imgStandardInnEvening from "./assets/images/StandardInnEvening.jpeg";
import imgStandardInnGarden from "./assets/images/StandardInnGarden.jpeg";
import imgTheStandard from "./assets/images/TheStandard.jpeg";
import imgTheStandardLevel from "./assets/images/TheStandardLevel.jpeg";
import imgTowanShellPicking from "./assets/images/TowanShellPicking.jpeg";
import imgTregew from "./assets/images/Tregew.jpeg";
import imgTregewFish from "./assets/images/TregewFish.jpeg";
import imgTregewFoodBarn from "./assets/images/TregewFoodBarn.jpeg";
import imgTregewToasties from "./assets/images/TregewToasties.jpeg";
import imgTrelissick from "./assets/images/Trelissick.jpeg";
import imgTrelissick2 from "./assets/images/Trelissick2.jpeg";

// ─── DATA & CONSTANTS ────────────────────────────────────────────────
// Passwords are stored as SHA-256 hashes rather than plaintext, since this is a
// static site with no server to check credentials against — plaintext here
// would ship straight into the public JS bundle.
const SITE_PASSWORD_HASH = "5d7e02bb032b944f927203f1cef3781ae45eebfa0296c45cd46663ed91b081da";
const ADMIN_USERS = [
  { email: "dom@domguinness.com", passwordHash: "3169643d17f35ef886b8131f8c9d1480ea1bd88a7db19842ca2a37db81abc858" },
  { email: "davina@davinaguinness.com", passwordHash: "3169643d17f35ef886b8131f8c9d1480ea1bd88a7db19842ca2a37db81abc858" },
];

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const HERO_IMAGES = [
  { url: imgPortscathofromtheAir2, caption: "Portscatho from the Air" },
  { url: imgHouse, caption: "The House" },
  { url: imgPorthcurnickPortcatho, caption: "Portscatho from Porthcurnick" },
];

const BLOG_POSTS = [
  { id: "the-search", title: "The Search", date: "2024-03-15", excerpt: "How we discovered our dream property on the Roseland Peninsula, after months of searching the Cornish coastline for the perfect retreat.", content: "It all began with a winter drive along the south Cornwall coast. We'd spent weekends trawling property websites, but nothing compared to seeing the Roseland Peninsula in person. The winding lanes, the glimpses of turquoise sea through hedgerows heavy with wild garlic — we knew this was where we wanted to be.\n\nPortscatho captured our hearts immediately. A proper Cornish village with a genuine community, a wonderful store, and that extraordinary stretch of coastline. When we saw the listing for Chy Kernyk — perched above the beach with uninterrupted views towards Gull Rock — we booked a viewing within the hour.\n\nStanding in the garden that first afternoon, watching the light change across the water, we looked at each other and simply knew. This was it." },
  { id: "the-purchase", title: "The Purchase", date: "2024-05-20", excerpt: "The story of acquiring Chy Kernyk — navigating surveys, conveyancing, and the peculiarities of buying a Cornish coastal property.", content: "Buying a property in Cornwall comes with its own unique set of adventures. The survey revealed the house had good bones but needed significant updating to become the retreat we envisioned. Negotiations were straightforward — the sellers were a lovely couple who wanted to know the house would be loved.\n\nThe conveyancing threw up some interesting quirks: ancient rights of way, coastal erosion considerations, and a boundary that was defined by a granite boulder that had apparently been there since the Bronze Age. Very Cornwall.\n\nThe day we finally collected the keys, we drove straight down from London. It was raining — properly Cornish rain, horizontal and enthusiastic — but as we opened the front door and looked through to that view, the sun broke through. We took it as a sign." },
  { id: "the-design", title: "The Design", date: "2024-07-10", excerpt: "Working with our architect to reimagine the space — balancing modern comfort with coastal character, and making the most of those extraordinary views.", content: "We wanted the house to feel like it belonged to the landscape. No glass boxes or stark modernism — instead, a sensitive renovation that would enhance what was already there while making the most of the extraordinary setting.\n\nOur architect understood immediately. Natural materials — local stone, timber, lime render in soft whites — and generous windows positioned to frame specific views. The kitchen would look towards the headland. The main bedroom would wake to sunrise over the sea. The living room would open onto a terrace where you could watch storms roll in.\n\nEvery decision was guided by one question: does this bring us closer to the landscape or push us further away?" },
  { id: "west-dean-stone-carving", title: "The West Dean Adventure in Stone Carving", date: "2024-09-05", excerpt: "An unexpected detour into the world of stone carving at West Dean College, creating a piece that would become part of the house itself.", content: "Sometimes the best ideas come from the most unexpected places. A weekend course at West Dean College in stone carving was meant to be a bit of fun — a break from renovation stress. Instead, it became one of the most meaningful parts of the whole project.\n\nWorking with Portland stone, learning to read the grain, feeling the chisel find its line — there's something deeply satisfying about shaping stone. By the end of the weekend, we'd each carved a piece that would be set into the garden wall at Chy Kernyk.\n\nThe Cornish name of the house — Chy Kernyk means 'Cornish House' — felt even more appropriate with hand-carved stone becoming part of its fabric. A house made with hands as well as hearts." },
  { id: "the-build", title: "The Build", date: "2025-01-15", excerpt: "Dust, decisions, and determination — the renovation journey from stripped-back shell to the coastal retreat we'd always dreamed of.", content: "Nothing prepares you for the reality of a major renovation 300 miles from where you live. Weekly site visits became our rhythm — Friday evening drives down the A303, arriving late to a village wrapped in sea mist.\n\nThe builders were extraordinary. Local craftsmen who understood the materials and the climate. They talked about the house as if it were alive — 'she needs to breathe,' they'd say about the lime render. 'Let her settle,' about the new oak beams.\n\nThere were challenges: supply delays, a discovery of an old well beneath the kitchen floor (which became a feature rather than a problem), and a memorable week when Storm Éowyn tested every window seal. But watching the house transform — seeing our vision become reality — was worth every dusty, exhausting, wonderful moment." },
];

const FOOD_PLACES = [
  { id: "portscatho-stores", name: "Portscatho Stores", desc: "The heart of the village — exceptional deli, fresh bread daily, local produce, and everything you need. Their pasties are legendary.", image: imgPortscathoStores, tags: ["deli", "groceries", "bakery"], website: "#", location: "Portscatho", foodType: "buying" },
  { id: "tregew-food-barn", name: "Tregew Food Barn", desc: "A weekly barn full of local food produce from Bread to Veg and everything in between.", image: imgTregewFoodBarn, tags: ["farm shop", "local produce"], website: "https://www.foodbarn-tregew.co.uk/", location: "Near Froe", foodType: "buying" },
  { id: "curgurrell-farm-shop", name: "Curgurrell Farm Shop", desc: "Family-run farm shop with their own livestock and kitchen garden produce. Seasonal, honest, and utterly delicious.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", tags: ["farm shop", "meat", "seasonal"], website: "#", location: "Curgurrell", foodType: "buying" },
  { id: "hidden-hut", name: "Hidden Hut", desc: "Cornwall's most famous beach café. Their feast nights are the stuff of legend — book months ahead. By day, superb cakes and coffee on Porthcurnick Beach.", image: imgHiddenHut, tags: ["restaurant", "beach", "feast nights"], website: "#", location: "Porthcurnick Beach", foodType: "eating" },
  { id: "standard", name: "The Standard", desc: "Contemporary dining with impeccable local sourcing. The tasting menu is a journey through Cornwall's finest ingredients.", image: imgTheStandardLevel, tags: ["restaurant", "fine dining"], website: "#", location: "Falmouth", foodType: "eating" },
  { id: "tresanton", name: "Tresanton", desc: "Olga Polizzi's celebrated hotel restaurant in St Mawes. Mediterranean-influenced cooking with stunning harbour views.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&q=80", tags: ["restaurant", "hotel", "harbour views"], website: "#", location: "St Mawes", foodType: "eating" },
  { id: "the-meat-counter", name: "The Meat Counter", desc: "Falmouth's finest butcher and charcuterie. Dry-aged steaks, house-made sausages, and a deli counter that demands multiple visits.", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", tags: ["butcher", "deli", "charcuterie"], website: "#", location: "Falmouth", foodType: "eating" },
  { id: "scathos-scoops", name: "Scatho's Scoops", desc: "Artisan ice cream made in Portscatho. Clotted cream, Cornish strawberry, and salted caramel are unmissable on a warm afternoon.", image: imgScathosScoops, tags: ["ice cream", "treats"], website: "#", location: "Portscatho", foodType: "eating" },
  { id: "shillakabooky-beach-hut", name: "Shillakabooky Beach Hut", desc: "A charming beach hut serving simple, delicious food right by the water. A perfect stop before or after a walk along the coast path.", image: imgShillakabookyBeachHut, tags: ["beach hut", "casual", "coastal"], website: "#", location: "Roseland Peninsula", foodType: "eating" },
  { id: "cafe-mylor", name: "Café Mylor", desc: "A relaxed waterside café at Mylor Yacht Harbour, serving brunch, coffee, and light lunches with views over the boats.", image: imgCafeMylor, tags: ["cafe", "waterside", "brunch"], website: "#", location: "Mylor Harbour", foodType: "eating" },
  { id: "waitrose", name: "Waitrose", desc: "The nearest large supermarket, well stocked for a full shop — good wine selection and a decent deli counter too.", image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80", tags: ["supermarket", "groceries"], website: "#", location: "Truro", foodType: "buying" },
];

const ACTIVITIES = [
  { id: "fish-n-trips", name: "Fish n Trips", desc: "Join local fisherman on a mackerel fishing trip from St Mawes harbour. Catch your supper and learn about Cornwall's maritime heritage.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", tags: ["fishing", "boat"] },
  { id: "surfing-newquay", name: "Surfing in Newquay", desc: "An hour's drive takes you to Cornwall's surf capital. Lessons available for all ages and abilities at Fistral and Watergate Bay.", image: "https://images.unsplash.com/photo-1502680390548-bdbac40b3e1c?w=800&q=80", tags: ["surfing", "adventure"] },
  { id: "king-harry-ferry", name: "King Harry Ferry", desc: "A historic chain ferry crossing the River Fal, in operation since 1888. A scenic and surprisingly fun way to explore the Roseland and beyond.", image: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&q=80", tags: ["ferry", "river", "scenic"] },
  { id: "heligan", name: "The Lost Gardens of Heligan", desc: "One of the most beloved gardens in England. Explore the jungle, the productive gardens, and the famous sleeping mud maid.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80", tags: ["gardens", "history"], category: "garden" },
  { id: "burncoose", name: "Burncoose Nurseries", desc: "One of the UK's finest nurseries set in 30 acres of woodland garden. Magnificent camellias, magnolias, and rare plants.", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", tags: ["gardens", "plants"], category: "garden" },
  { id: "eden-project", name: "Eden Project", desc: "The iconic biomes housing the world's largest indoor rainforest. A must-visit that never disappoints, whatever the weather.", image: imgEdenProject, tags: ["attraction", "family"], category: "garden" },
  { id: "caerhayes", name: "Caerhayes Castle Gardens", desc: "A spectacular woodland garden famous for its world-renowned collection of magnolias, best seen in spring. The castle itself is a Nash-designed gem.", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80", tags: ["gardens", "magnolias", "castle"], category: "garden" },
  { id: "trelissick-garden", name: "Trelissick Garden", desc: "A National Trust garden overlooking the Fal estuary, with sub-tropical planting, woodland walks, and a wonderful walled garden.", image: imgTrelissick, tags: ["gardens", "national trust", "views"], category: "garden" },
  { id: "st-ives", name: "St Ives", desc: "The jewel of the north coast. Tate St Ives, the Barbara Hepworth Museum, cobbled lanes, and some of the best light in Britain.", image: "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?w=800&q=80", tags: ["town", "art", "culture"] },
  { id: "towan", name: "Towan Beach", desc: "A National Trust beach reached by a short walk, with rockpools, soft sand, and usually far fewer people than the popular spots.", image: imgTowanShellPicking, tags: ["beach", "rockpools", "family"], category: "beach" },
  { id: "pendower", name: "Pendower Beach", desc: "A long, gently shelving sandy beach next to Carne, backed by dunes and countryside. Great for a proper stretch-your-legs walk.", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80", tags: ["beach", "walking", "family"], category: "beach" },
  { id: "fistral", name: "Fistral Beach", desc: "Cornwall's most famous surf beach in Newquay. Big Atlantic swells, a lively beach scene, and plenty of surf schools for all levels.", image: "https://images.unsplash.com/photo-1533760881669-80d0a13043cb?w=800&q=80", tags: ["beach", "surfing"], category: "beach" },
];

const WALKS = [
  { id: "nare", name: "Nare Head", desc: "A spectacular circular walk around Nare Head with panoramic views of the coast. Moderate difficulty with some steep sections.", length: "4.2 miles", difficulty: "Moderate", parking: "Park at Carne Beach car park (free for National Trust members). Can get busy in summer — arrive before 10am.", eating: "The Shillakabooky Beach Hut is a perfect post-walk stop for something simple and delicious right by the water.", image: imgNareHead, stravaRouteId: "3507453955926855126" },
  { id: "curgurrell", name: "Curgurrell Creek", desc: "A gentle walk through ancient woodland and along the creek. Perfect for a peaceful morning stroll or a family outing with young children.", length: "2.8 miles", difficulty: "Easy", parking: "Limited roadside parking near Curgurrell Farm. Please park considerately and respect local residents.", eating: "Curgurrell Farm Shop for provisions, or continue to Portscatho for the full range of options.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", stravaRouteId: "3508117142736593884" },
  { id: "towan", name: "Towan Beach Circuit", desc: "A beautiful coastal and inland loop taking in Towan Beach, farmland, and quiet lanes. Wonderful wildflowers in spring and early summer.", length: "3.5 miles", difficulty: "Easy-Moderate", parking: "Towan Beach car park. Honesty box payment.", eating: "Pack a picnic from Portscatho Stores — Towan Beach is a perfect lunch spot.", image: imgTowanShellPicking, stravaRouteId: "3508117195142270626" },
  { id: "st-anthony", name: "St Anthony Head", desc: "Walk to the lighthouse at St Anthony Head with views across Falmouth Bay. One of the finest viewpoints in Cornwall.", length: "3.0 miles", difficulty: "Easy-Moderate", parking: "National Trust car park at Place. Follow signs carefully — the lanes are narrow.", eating: "The Place restaurant (seasonal) or head to St Mawes for the Tresanton or the pub on the quay.", image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&q=80", stravaRouteId: "3508119257673450600" },
  { id: "st-mawes", name: "St Mawes Castle Walk", desc: "A gentle walk around St Mawes taking in the castle, harbour, and stunning views of the Fal estuary and Pendennis Castle opposite.", length: "2.0 miles", difficulty: "Easy", parking: "St Mawes main car park (pay and display). Free in winter months.", eating: "Spoilt for choice — the Tresanton for something special, the Watch House for fish and chips, or the Rising Sun for a proper pub lunch.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", stravaRouteId: "3508117047959651292" },
];

const PARKRUNS = [
  { name: "Trelissick", url: "https://www.parkrun.org.uk/trelissick/", desc: "A beautiful course through the National Trust grounds at Trelissick, with views over the Fal estuary. Two laps, mostly flat with one gentle climb." },
  { name: "Lanhydrock", url: "https://www.parkrun.org.uk/lanhydrock/", desc: "Set in the stunning grounds of Lanhydrock House. A single-lap course through parkland and woodland. Undulating terrain." },
  { name: "Penryn Campus", url: "https://www.parkrun.org.uk/penryncampus/", desc: "A mixed trail course around Falmouth University's Penryn Campus, taking in woodland paths and open parkland. Undulating with a friendly campus atmosphere." },
  { name: "Lost Gardens of Heligan", url: "https://www.parkrun.org.uk/heligan/", desc: "A magical course through the famous Lost Gardens of Heligan, past the productive gardens and jungle valley. Undulating woodland trails — book garden entry in advance." },
  { name: "Eden Project", url: "https://www.parkrun.org.uk/edenproject/", desc: "A scenic lap around the Eden Project's outer perimeter, with views down over the biomes. Hilly in places, with a fast finish downhill." },
  { name: "Heartlands", url: "https://www.parkrun.org.uk/heartlands/", desc: "A flat, fast course through Heartlands' Cornish mining heritage park in Pool, taking in gardens, play areas, and industrial landmarks." },
];

const REMEDIES = [
  { category: "Medical", items: [
    { name: "Roseland Surgery", detail: "St Mawes — 01326 270218", icon: "🏥" },
    { name: "Treliske Hospital (Royal Cornwall)", detail: "Truro — 01872 250000 — A&E available 24hrs", icon: "🚑" },
    { name: "NHS 111", detail: "Call 111 for non-emergency medical advice", icon: "📞" },
  ]},
  { category: "Emergency Services", items: [
    { name: "Emergency", detail: "999 — Police, Fire, Ambulance, Coastguard", icon: "🆘" },
    { name: "Coastguard", detail: "999 and ask for Coastguard", icon: "⚓" },
  ]},
  { category: "House Maintenance", items: [
    { name: "Plumber", detail: "Roseland Plumbing — 01872 XXXXXX", icon: "🔧" },
    { name: "Electrician", detail: "Portscatho Electrical — 01872 XXXXXX", icon: "⚡" },
    { name: "Stopcock Location", detail: "Under the kitchen sink, left side. Turn clockwise to close.", icon: "🚰" },
    { name: "Fusebox Location", detail: "Utility room, wall-mounted to the right of the door.", icon: "🔌" },
    { name: "Boiler", detail: "Utility room. Instructions in the red folder on the shelf. Emergency off switch is the red button.", icon: "🌡️" },
  ]},
  { category: "Useful Numbers", items: [
    { name: "Property Manager", detail: "Contact for any issues — 07XXX XXXXXX", icon: "🏠" },
    { name: "WiFi Password", detail: "Network: ChyKernyk-Guest / Password: SeaView2025", icon: "📶" },
  ]},
  { category: "House Rules", items: [
    { name: "Dogs", detail: "Well behaved dogs welcome downstairs only.", icon: "🐾" },
  ]},
];

const GALLERY_IMAGES = [
  { id: 1, url: imgBarbaraHepworthGarden, caption: "Barbara Hepworth Garden" },
  { id: 2, url: imgBarbaraHepworthStudio, caption: "Barbara Hepworth Studio" },
  { id: 3, url: imgBarbaraHepworthStudio2, caption: "Barbara Hepworth Studio II" },
  { id: 4, url: imgCafeMylor, caption: "Café Mylor" },
  { id: 5, url: imgEdenProject, caption: "Eden Project" },
  { id: 6, url: imgFishNTrips, caption: "Fish n Trips" },
  { id: 7, url: imgFishingOffRocks, caption: "Fishing off the Rocks" },
  { id: 8, url: imgHarbour, caption: "The Harbour" },
  { id: 9, url: imgHiddenHut, caption: "The Hidden Hut" },
  { id: 10, url: imgHiddenHutAerial, caption: "The Hidden Hut from the Air" },
  { id: 11, url: imgHiddenHutFeast, caption: "Hidden Hut Feast Night" },
  { id: 12, url: imgHiddenHutFeast2, caption: "Hidden Hut Feast Night II" },
  { id: 13, url: imgHiddenHutfromBeach, caption: "The Hidden Hut from the Beach" },
  { id: 14, url: imgHouse, caption: "The House" },
  { id: 15, url: imgHouseEast, caption: "The House, East Side" },
  { id: 16, url: imgHouseFromRoad, caption: "The House from the Road" },
  { id: 17, url: imgHouseNorth, caption: "The House, North Side" },
  { id: 18, url: imgJuniorRaceWeek, caption: "Junior Race Week" },
  { id: 19, url: imgKitchenToBe, caption: "The Kitchen-to-Be" },
  { id: 20, url: imgNareHead, caption: "Nare Head" },
  { id: 21, url: imgPorthcurnick, caption: "Porthcurnick Beach" },
  { id: 22, url: imgPorthcurnickPortcatho, caption: "Porthcurnick towards Portscatho" },
  { id: 23, url: imgPorthcurnickPortcatho2, caption: "Porthcurnick towards Portscatho II" },
  { id: 24, url: imgPortscathoFromTheAir, caption: "Portscatho from the Air" },
  { id: 25, url: imgPortscathoHarbour, caption: "Portscatho Harbour" },
  { id: 26, url: imgPortscathoHarbour2, caption: "Portscatho Harbour II" },
  { id: 27, url: imgPortscathoStores, caption: "Portscatho Stores" },
  { id: 28, url: imgPortscathofromtheAir2, caption: "Portscatho from the Air II" },
  { id: 29, url: imgPurchaseDay, caption: "Purchase Day" },
  { id: 30, url: imgRalphs, caption: "Ralph's" },
  { id: 31, url: imgScathosScoops, caption: "Scatho's Scoops" },
  { id: 32, url: imgShillakabookyBeachHut, caption: "Shillakabooky Beach Hut" },
  { id: 33, url: imgStIves, caption: "St Ives" },
  { id: 34, url: imgStMawesHarbour, caption: "St Mawes Harbour" },
  { id: 35, url: imgStMawesHarbour2, caption: "St Mawes Harbour II" },
  { id: 36, url: imgStMawesHarbourWall, caption: "St Mawes Harbour Wall" },
  { id: 37, url: imgStandardInnEvening, caption: "The Standard Inn — Evening" },
  { id: 38, url: imgStandardInnGarden, caption: "The Standard Inn — Garden" },
  { id: 39, url: imgTheStandard, caption: "The Standard Inn" },
  { id: 40, url: imgTowanShellPicking, caption: "Shell Picking at Towan" },
  { id: 41, url: imgTregew, caption: "Tregew" },
  { id: 42, url: imgTregewFish, caption: "Tregew Fish" },
  { id: 43, url: imgTregewFoodBarn, caption: "Tregew Food Barn" },
  { id: 44, url: imgTregewToasties, caption: "Tregew Toasties" },
  { id: 45, url: imgTrelissick, caption: "Trelissick" },
  { id: 46, url: imgTrelissick2, caption: "Trelissick II" },
];

// ─── AROUND & ABOUT MAP ─────────────────────────────────────────────
// Pins are stored in Supabase so admin-added pins are visible to every
// visitor, not just the browser that added them (this site has no
// server of its own to host that data).
const SUPABASE_URL = "https://jcjhnscpunecubmcmkzr.supabase.co";
const SUPABASE_KEY = "sb_publishable_m4KQIVk-2m3uA0dJCXJQuA_sJvh4chZ";
const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

async function fetchPins() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pins?select=*&order=created_at.asc`, {
    headers: SUPABASE_HEADERS,
  });
  if (!res.ok) throw new Error("Failed to load pins");
  return res.json();
}

async function createPin(pin) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pins`, {
    method: "POST",
    headers: { ...SUPABASE_HEADERS, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(pin),
  });
  if (!res.ok) throw new Error("Failed to save pin");
  const rows = await res.json();
  return rows[0];
}

async function deletePinById(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pins?id=eq.${id}`, {
    method: "DELETE",
    headers: SUPABASE_HEADERS,
  });
  if (!res.ok) throw new Error("Failed to delete pin");
}

// ─── VISITORS BOOK ───────────────────────────────────────────────────
// Entries (and their photos) live in Supabase for the same reason pins do —
// this is a static site with no server of its own. Photos go to a separate
// storage bucket, not the site's bundled gallery.
async function fetchVisitorEntries() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/visitor_entries?select=*&order=entry_date.desc,created_at.desc`, {
    headers: SUPABASE_HEADERS,
  });
  if (!res.ok) throw new Error("Failed to load visitors book entries");
  return res.json();
}

async function createVisitorEntry(entry) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/visitor_entries`, {
    method: "POST",
    headers: { ...SUPABASE_HEADERS, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to save entry");
  const rows = await res.json();
  return rows[0];
}

async function deleteVisitorEntry(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/visitor_entries?id=eq.${id}`, {
    method: "DELETE",
    headers: SUPABASE_HEADERS,
  });
  if (!res.ok) throw new Error("Failed to delete entry");
}

async function uploadVisitorPhoto(file) {
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/visitor-photos/${encodeURIComponent(path)}`, {
    method: "POST",
    headers: { ...SUPABASE_HEADERS, "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error("Failed to upload photo");
  return `${SUPABASE_URL}/storage/v1/object/public/visitor-photos/${encodeURIComponent(path)}`;
}

// What a pin can link to, and how each category is presented on the map.
// `page` is the nav-less page it should be reachable from via the map's
// filter bar (omitted for categories that still have their own nav link).
const PIN_TYPES = {
  "walk-detail": { label: "Walks", color: "#c8a2c8", items: WALKS, getLabel: i => i.name, getId: i => i.id, getImage: i => i.image, getSummary: i => i.desc, page: "walks", subPageType: "walk-detail" },
  "activity-detail": { label: "Days Out", color: "#f97316", items: ACTIVITIES.filter(a => !a.category || a.id === "eden-project"), getLabel: i => i.name, getId: i => i.id, getImage: i => i.image, getSummary: i => i.desc, page: "activities", subPageType: "activity-detail" },
  "garden": { label: "Gardens", color: "#84cc16", items: ACTIVITIES.filter(a => a.category === "garden"), getLabel: i => i.name, getId: i => i.id, getImage: i => i.image, getSummary: i => i.desc, page: "gardens", subPageType: "activity-detail" },
  "beach": { label: "Beaches", color: "#eab308", items: ACTIVITIES.filter(a => a.category === "beach"), getLabel: i => i.name, getId: i => i.id, getImage: i => i.image, getSummary: i => i.desc, page: "beaches", subPageType: "activity-detail" },
  "eating-out": { label: "Eating Out", color: "#dc2626", items: FOOD_PLACES.filter(f => f.foodType === "eating"), getLabel: i => i.name, getId: i => i.id, getImage: i => i.image, getSummary: i => i.desc, page: "eating-out", subPageType: "food-detail" },
  "buying-food": { label: "Buying Food", color: "#10b981", items: FOOD_PLACES.filter(f => f.foodType === "buying"), getLabel: i => i.name, getId: i => i.id, getImage: i => i.image, getSummary: i => i.desc, page: "buying-food", subPageType: "food-detail" },
  "parkrun": { label: "parkrun", color: "#1e3a8a", items: PARKRUNS, getLabel: i => i.name, getId: i => i.name, getImage: () => null, getSummary: i => i.desc, page: "parkrun" },
};

// Navigates to whatever a pin links to — a detail subpage if the category
// has one (walks, activities, food), or straight to the list page (parkrun).
function navigateToPin(pin, setPage, setSubPage) {
  const type = PIN_TYPES[pin.link_type];
  if (!type) return;
  if (type.subPageType) {
    setSubPage({ type: type.subPageType, id: pin.link_id });
  } else if (type.page) {
    setPage(type.page);
  }
  window.scrollTo(0, 0);
}

// The property's location — ///latches.invisible.rope
const PROPERTY_LOCATION = { lat: 50.182204, lng: -4.976218 };

// Reference points shown on the map for orientation (not clickable pins).
const MAP_LANDMARKS = [
  { lat: 50.1533, lng: -5.0708, label: "Falmouth" },
  { lat: 50.1547, lng: -5.0136, label: "St Mawes" },
  { ...PROPERTY_LOCATION, label: "Portscatho", isHome: true },
  { lat: 50.1875, lng: -4.9130, label: "Nare Head" },
  { lat: 50.2211, lng: -4.8330, label: "Portloe" },
  { lat: 50.2180, lng: -4.9130, label: "Veryan" },
  { lat: 50.2650, lng: -4.9110, label: "Tregony" },
  { lat: 50.2213, lng: -4.7936, label: "Dodman Point" },
];

// Corners used to fit the map's initial view — the Roseland Peninsula.
const MAP_BOUNDS = [
  [50.13, -5.06],
  [50.28, -4.82],
];

// ─── STYLES ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --ocean: #1a3a4a;
    --ocean-light: #2a5a6a;
    --sand: #f5f0e8;
    --sand-dark: #e8e0d0;
    --gold: #c5a55a;
    --gold-light: #d4b86a;
    --stone: #8b8578;
    --coral: #d4856a;
    --white: #fefdfb;
    --text: #2a2a28;
    --text-light: #6b6b65;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Outfit', system-ui, sans-serif;
  }

  * { margin:0; padding:0; box-sizing:border-box; }

  .ck-app {
    font-family: var(--font-body);
    color: var(--text);
    background: var(--white);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── NAV ── */
  .ck-nav {
    position: fixed; top:0; left:0; right:0; z-index:100;
    background: rgba(254,253,251,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(26,58,74,0.08);
    transition: all 0.4s ease;
  }
  .ck-nav.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.06); }
  .ck-nav-inner {
    max-width: 1400px; margin:0 auto;
    display:flex; align-items:center; justify-content:space-between;
    padding: 0.75rem 2rem;
  }
  .ck-logo {
    font-family: var(--font-display);
    font-size: 1.6rem; font-weight: 600;
    color: var(--ocean);
    letter-spacing: 0.05em;
    cursor:pointer;
    transition: opacity 0.3s;
  }
  .ck-logo:hover { opacity:0.7; }

  .ck-nav-links {
    display:flex; gap:0.25rem; align-items:center; flex-wrap:wrap;
    justify-content:center;
  }
  .ck-nav-link {
    background:none; border:none; cursor:pointer;
    font-family: var(--font-body);
    font-size: 0.8rem; font-weight: 400;
    color: var(--text-light);
    padding: 0.5rem 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.3s;
    border-radius: 4px;
    white-space: nowrap;
  }
  .ck-nav-link:hover { color: var(--ocean); background: rgba(26,58,74,0.04); }
  .ck-nav-link.active { color: var(--ocean); font-weight: 500; }

  .ck-nav-auth {
    display:flex; gap:0.5rem; align-items:center;
  }
  .ck-btn-login {
    background: var(--ocean); color:white; border:none;
    padding: 0.5rem 1.2rem; border-radius:6px; cursor:pointer;
    font-family: var(--font-body); font-size:0.78rem;
    font-weight:500; letter-spacing:0.04em; text-transform:uppercase;
    transition: all 0.3s;
  }
  .ck-btn-login:hover { background: var(--ocean-light); transform: translateY(-1px); }
  .ck-btn-logout {
    background:none; color: var(--coral); border:1px solid var(--coral);
    padding: 0.4rem 1rem; border-radius:6px; cursor:pointer;
    font-family: var(--font-body); font-size:0.75rem;
    font-weight:500; letter-spacing:0.04em; text-transform:uppercase;
    transition: all 0.3s;
  }
  .ck-btn-logout:hover { background: var(--coral); color:white; }

  .ck-hamburger {
    display:none; background:none; border:none; cursor:pointer;
    width:32px; height:32px; position:relative;
  }
  .ck-hamburger span {
    display:block; width:24px; height:2px; background:var(--ocean);
    position:absolute; left:4px; transition: all 0.3s;
  }
  .ck-hamburger span:nth-child(1) { top:8px; }
  .ck-hamburger span:nth-child(2) { top:15px; }
  .ck-hamburger span:nth-child(3) { top:22px; }
  .ck-hamburger.open span:nth-child(1) { transform:rotate(45deg); top:15px; }
  .ck-hamburger.open span:nth-child(2) { opacity:0; }
  .ck-hamburger.open span:nth-child(3) { transform:rotate(-45deg); top:15px; }

  .ck-mobile-menu {
    display:none; position:fixed; top:60px; left:0; right:0; bottom:0;
    background: var(--white); z-index:99; padding:2rem;
    flex-direction:column; gap:0.5rem; overflow-y:auto;
  }
  .ck-mobile-menu.open { display:flex; }
  .ck-mobile-menu .ck-nav-link {
    font-size:1rem; padding:0.8rem 0; text-align:left;
    border-bottom: 1px solid var(--sand);
  }

  @media(max-width:900px) {
    .ck-nav-links, .ck-nav-auth { display:none; }
    .ck-hamburger { display:block; }
    .ck-mobile-menu .ck-nav-auth-mobile { display:flex; gap:0.5rem; margin-top:1rem; }
  }

  /* ── HERO ── */
  .ck-hero {
    position:relative; height:100vh; min-height:600px;
    overflow:hidden; display:flex; align-items:center; justify-content:center;
  }
  .ck-hero-slide {
    position:absolute; inset:0;
    background-size:cover; background-position:center;
    transition: opacity 1.2s ease;
    opacity:0;
  }
  .ck-hero-slide.active { opacity:1; }
  .ck-hero-slide::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(180deg, rgba(26,58,74,0.15) 0%, rgba(26,58,74,0.5) 100%);
  }
  .ck-hero-content {
    position:relative; z-index:2; text-align:center; color:white;
    padding: 2rem;
  }
  .ck-hero-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 300;
    letter-spacing: 0.06em;
    line-height: 1.1;
    text-shadow: 0 2px 40px rgba(0,0,0,0.3);
  }
  .ck-hero-subtitle {
    font-family: var(--font-body);
    font-size: clamp(0.9rem, 2vw, 1.15rem);
    font-weight: 300;
    margin-top: 1.2rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    opacity: 0.85;
  }
  .ck-hero-caption {
    position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
    z-index:3; color:rgba(255,255,255,0.7);
    font-size:0.8rem; letter-spacing:0.1em;
    text-transform:uppercase;
  }
  .ck-hero-dots {
    position:absolute; bottom:4rem; left:50%; transform:translateX(-50%);
    z-index:3; display:flex; gap:0.75rem;
  }
  .ck-hero-dot {
    width:8px; height:8px; border-radius:50%;
    background:rgba(255,255,255,0.4); border:none; cursor:pointer;
    transition: all 0.3s;
  }
  .ck-hero-dot.active { background:white; transform:scale(1.3); }

  /* ── SECTIONS ── */
  .ck-section {
    max-width:1200px; margin:0 auto;
    padding: 5rem 2rem;
  }
  .ck-section-wide { max-width:1400px; }
  .ck-section-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 300;
    color: var(--ocean);
    margin-bottom: 0.5rem;
    letter-spacing: 0.02em;
  }
  .ck-section-line {
    width: 60px; height:2px;
    background: var(--gold);
    margin-bottom: 2rem;
  }
  .ck-back-link {
    background:none; border:none; cursor:pointer;
    color:var(--ocean); font-family:var(--font-body);
    font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase;
    margin-bottom: 2rem; padding:0;
  }
  .ck-back-link:hover { text-decoration:underline; color:var(--gold); }
  .ck-section-desc {
    font-size:1.05rem; line-height:1.8;
    color: var(--text-light);
    margin-bottom:3rem;
  }

  /* ── PAGE HEADER ── */
  .ck-page-header {
    padding-top:120px; padding-bottom:3rem;
    background: linear-gradient(180deg, var(--sand) 0%, var(--white) 100%);
  }
  .ck-page-header-inner {
    max-width:1200px; margin:0 auto; padding:0 2rem;
  }
  .ck-breadcrumb {
    font-size:0.8rem; color:var(--stone);
    margin-bottom:1rem; letter-spacing:0.04em; text-transform:uppercase;
  }
  .ck-breadcrumb button {
    background:none; border:none; cursor:pointer;
    color:var(--ocean); font-family:var(--font-body);
    font-size:0.8rem; letter-spacing:0.04em; text-transform:uppercase;
  }
  .ck-breadcrumb button:hover { text-decoration:underline; }

  /* ── CARDS ── */
  .ck-grid {
    display:grid; gap:2rem;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
  .ck-grid-3 { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

  .ck-card {
    border-radius:12px; overflow:hidden;
    background:white;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    transition: all 0.4s ease;
    cursor:pointer;
  }
  .ck-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(0,0,0,0.1);
  }
  .ck-card-img {
    width:100%; height:220px; object-fit:cover;
    transition: transform 0.6s ease;
  }
  .ck-card:hover .ck-card-img { transform:scale(1.05); }
  .ck-card-img-wrap { overflow:hidden; }
  .ck-card-body { padding:1.5rem; }
  .ck-card-title {
    font-family: var(--font-display);
    font-size:1.4rem; font-weight:500;
    color: var(--ocean);
    margin-bottom:0.5rem;
  }
  .ck-card-text {
    font-size:0.92rem; line-height:1.7;
    color: var(--text-light);
  }
  .ck-card-meta {
    font-size:0.78rem; color:var(--stone);
    margin-bottom:0.4rem; letter-spacing:0.04em;
    text-transform:uppercase;
  }
  .ck-card-tags { display:flex; gap:0.4rem; margin-top:0.75rem; flex-wrap:wrap; }
  .ck-tag {
    font-size:0.72rem; padding:0.25rem 0.6rem;
    border-radius:20px; background:var(--sand);
    color:var(--stone); letter-spacing:0.03em; text-transform:uppercase;
  }

  /* ── DETAIL PAGE ── */
  .ck-detail-hero {
    width:100%; height:50vh; min-height:300px;
    object-fit:cover; margin-top:60px;
  }
  .ck-detail-content {
    max-width:1200px; margin:0 auto; padding:3rem 2rem;
  }
  .ck-detail-title {
    font-family:var(--font-display);
    font-size: clamp(2rem,4vw,3rem);
    font-weight:400; color:var(--ocean);
    margin-bottom:1rem;
  }
  .ck-detail-body {
    font-size:1.05rem; line-height:1.9;
    color: var(--text);
  }
  .ck-detail-body p { margin-bottom:1.5rem; }
  .ck-detail-info {
    background:var(--sand); border-radius:12px;
    padding:2rem; margin:2rem 0;
  }
  .ck-detail-info h3 {
    font-family:var(--font-display);
    font-size:1.3rem; color:var(--ocean);
    margin-bottom:0.75rem;
  }
  .ck-detail-info p {
    font-size:0.95rem; line-height:1.7;
    color: var(--text-light);
  }
  .ck-detail-badge {
    display:inline-block; padding:0.3rem 0.8rem;
    background:var(--ocean); color:white;
    border-radius:20px; font-size:0.78rem;
    letter-spacing:0.04em; margin-right:0.5rem; margin-bottom:0.5rem;
  }

  /* ── GALLERY ── */
  .ck-gallery-grid {
    display:grid; gap:0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  .ck-gallery-item {
    position:relative; overflow:hidden; border-radius:8px;
    cursor:pointer; aspect-ratio:4/3;
  }
  .ck-gallery-item img {
    width:100%; height:100%; object-fit:cover;
    transition: transform 0.6s ease;
  }
  .ck-gallery-item:hover img { transform:scale(1.08); }
  .ck-gallery-item::after {
    content:attr(data-caption);
    position:absolute; bottom:0; left:0; right:0;
    padding:1rem; color:white; font-size:0.85rem;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    opacity:0; transition: opacity 0.3s;
    letter-spacing:0.03em;
  }
  .ck-gallery-item:hover::after { opacity:1; }

  /* ── LIGHTBOX ── */
  .ck-lightbox {
    position:fixed; inset:0; z-index:200;
    background:rgba(0,0,0,0.92);
    display:flex; align-items:center; justify-content:center;
    padding:2rem;
  }
  .ck-lightbox img {
    max-width:90vw; max-height:85vh;
    object-fit:contain; border-radius:8px;
  }
  .ck-lightbox-close {
    position:absolute; top:1.5rem; right:1.5rem;
    background:none; border:none; color:white;
    font-size:2rem; cursor:pointer; opacity:0.7;
    transition: opacity 0.3s;
  }
  .ck-lightbox-close:hover { opacity:1; }
  .ck-lightbox-caption {
    position:absolute; bottom:2rem; left:50%;
    transform:translateX(-50%); color:white;
    font-family:var(--font-display); font-size:1.2rem;
    letter-spacing:0.04em;
  }

  /* ── BLOG ── */
  .ck-blog-post { margin-bottom:2rem; }
  .ck-blog-date {
    font-size:0.78rem; color:var(--gold);
    letter-spacing:0.1em; text-transform:uppercase;
    margin-bottom:0.3rem;
  }
  .ck-read-more {
    display:inline-block; margin-top:0.75rem;
    color:var(--ocean); font-size:0.85rem; font-weight:500;
    letter-spacing:0.06em; text-transform:uppercase;
    border:none; background:none; cursor:pointer;
    transition: color 0.3s;
  }
  .ck-read-more:hover { color:var(--gold); }

  /* ── VISITORS BOOK ── */
  .ck-visitor-form {
    padding:2rem; border-radius:12px; background:var(--sand);
    margin-bottom:2.5rem;
  }
  .ck-visitor-form-title {
    font-family:var(--font-display); font-size:1.3rem;
    color:var(--ocean); margin-bottom:1.25rem;
  }
  .ck-visitor-form-filecount {
    font-size:0.8rem; color:var(--text-light); margin-top:0.4rem;
  }
  .ck-visitor-entries { display:flex; flex-direction:column; gap:1.5rem; }
  .ck-visitor-entry {
    padding:1.5rem; border-radius:12px; border:1px solid var(--sand-dark);
  }
  .ck-visitor-entry-header {
    display:flex; justify-content:space-between; align-items:baseline;
    flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;
  }
  .ck-visitor-entry-name {
    font-family:var(--font-display); font-size:1.2rem; color:var(--ocean);
  }
  .ck-visitor-entry-date {
    font-size:0.78rem; color:var(--gold);
    letter-spacing:0.08em; text-transform:uppercase;
  }
  .ck-visitor-entry-message {
    font-size:0.95rem; line-height:1.7; color:var(--text); white-space:pre-wrap;
  }
  .ck-visitor-entry-photos {
    display:grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap:0.5rem; margin-top:1rem;
  }
  .ck-visitor-entry-photos img {
    width:100%; aspect-ratio:1; object-fit:cover; border-radius:8px; cursor:pointer;
    transition: transform 0.3s;
  }
  .ck-visitor-entry-photos img:hover { transform:scale(1.05); }

  /* ── FORMS ── */
  .ck-form-group { margin-bottom:1.25rem; }
  .ck-label {
    display:block; font-size:0.8rem; font-weight:500;
    color:var(--text-light); margin-bottom:0.4rem;
    letter-spacing:0.06em; text-transform:uppercase;
  }
  .ck-input, .ck-textarea {
    width:100%; padding:0.75rem 1rem;
    border:1px solid var(--sand-dark);
    border-radius:8px; font-family:var(--font-body);
    font-size:0.95rem; color:var(--text);
    background:white; transition: border-color 0.3s;
  }
  .ck-input:focus, .ck-textarea:focus {
    outline:none; border-color:var(--ocean);
  }
  .ck-textarea { min-height:150px; resize:vertical; }
  .ck-btn {
    padding:0.7rem 1.8rem; border:none; border-radius:8px;
    font-family:var(--font-body); font-size:0.85rem;
    font-weight:500; letter-spacing:0.06em; text-transform:uppercase;
    cursor:pointer; transition: all 0.3s;
  }
  .ck-btn-primary { background:var(--ocean); color:white; }
  .ck-btn-primary:hover { background:var(--ocean-light); transform:translateY(-1px); }
  .ck-btn-secondary { background:var(--sand); color:var(--ocean); }
  .ck-btn-secondary:hover { background:var(--sand-dark); }
  .ck-btn-danger { background:#d44; color:white; }
  .ck-btn-danger:hover { background:#c33; }
  .ck-btn-sm { padding:0.4rem 1rem; font-size:0.78rem; }

  /* ── CALENDAR ── */
  .ck-cal { user-select:none; }
  .ck-cal-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:1.5rem;
  }
  .ck-cal-nav {
    background:none; border:1px solid var(--sand-dark);
    width:36px; height:36px; border-radius:8px;
    cursor:pointer; font-size:1.1rem; color:var(--ocean);
    display:flex; align-items:center; justify-content:center;
    transition: all 0.3s;
  }
  .ck-cal-nav:hover { background:var(--sand); }
  .ck-cal-month {
    font-family:var(--font-display);
    font-size:1.5rem; font-weight:400; color:var(--ocean);
  }
  .ck-cal-grid {
    display:grid; grid-template-columns:repeat(7,1fr); gap:2px;
  }
  .ck-cal-day-label {
    text-align:center; font-size:0.72rem; font-weight:500;
    color:var(--stone); padding:0.5rem;
    letter-spacing:0.08em; text-transform:uppercase;
  }
  .ck-cal-day {
    aspect-ratio:1; display:flex; align-items:center; justify-content:center;
    font-size:0.9rem; border-radius:8px;
    cursor:pointer; transition: all 0.2s;
    position:relative;
  }
  .ck-cal-day:hover { background:var(--sand); }
  .ck-cal-day.empty { cursor:default; }
  .ck-cal-day.empty:hover { background:transparent; }
  .ck-cal-day.today { font-weight:600; box-shadow:inset 0 0 0 2px var(--ocean); }
  .ck-cal-day.booked { background:#fde8e8; color:#a33; }
  .ck-cal-day.available { background:#e8f5e8; color:#3a7; }
  .ck-cal-day.owner { background:#e8f0fd; color:#36a; }
  .ck-cal-day-star {
    position:absolute; top:2px; right:4px;
    font-size:0.6rem; color:var(--gold); line-height:1;
  }
  .ck-cal-legend {
    display:flex; gap:1.5rem; margin-top:1.5rem; flex-wrap:wrap;
  }
  .ck-cal-legend-item {
    display:flex; align-items:center; gap:0.5rem;
    font-size:0.82rem; color:var(--text-light);
  }
  .ck-cal-legend-dot {
    width:14px; height:14px; border-radius:4px;
  }

  /* ── PARKRUN ── */
  .ck-parkrun-card {
    padding:1.5rem; border-radius:12px;
    border:1px solid var(--sand-dark);
    margin-bottom:1rem; transition: all 0.3s;
  }
  .ck-parkrun-card:hover {
    border-color:var(--ocean);
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .ck-parkrun-link {
    color:var(--ocean); text-decoration:none;
    font-family:var(--font-display); font-size:1.3rem;
    font-weight:500;
  }
  .ck-parkrun-link:hover { color:var(--gold); }

  /* ── REMEDIES ── */
  .ck-remedy-section { margin-bottom:2.5rem; }
  .ck-remedy-title {
    font-family:var(--font-display);
    font-size:1.4rem; color:var(--ocean);
    margin-bottom:1rem; font-weight:500;
  }
  .ck-remedy-item {
    display:flex; align-items:flex-start; gap:1rem;
    padding:1rem; border-radius:8px;
    border:1px solid var(--sand-dark);
    margin-bottom:0.5rem;
    transition: all 0.3s;
  }
  .ck-remedy-item:hover { border-color:var(--ocean); background:var(--sand); }
  .ck-remedy-icon { font-size:1.5rem; flex-shrink:0; }
  .ck-remedy-name { font-weight:500; color:var(--ocean); margin-bottom:0.2rem; }
  .ck-remedy-detail { font-size:0.9rem; color:var(--text-light); }

  /* ── CONTACT ── */
  .ck-contact-grid {
    display:grid; grid-template-columns:1fr 1fr; gap:3rem;
  }
  @media(max-width:768px) { .ck-contact-grid { grid-template-columns:1fr; } }
  .ck-map-container {
    position:relative; width:100%; height:400px; border-radius:12px; overflow:hidden;
    border:1px solid var(--sand-dark);
  }
  .ck-contact-info { display:flex; flex-direction:column; gap:1.5rem; }
  .ck-contact-item h3 {
    font-family:var(--font-display);
    font-size:1.2rem; color:var(--ocean);
    margin-bottom:0.3rem;
  }
  .ck-contact-item p {
    font-size:0.95rem; color:var(--text-light); line-height:1.6;
  }
  .ck-contact-item a { color:var(--ocean); text-decoration:none; }
  .ck-contact-item a:hover { color:var(--gold); }

  /* ── AROUND & ABOUT MAP ── */
  .ck-map-wrap {
    position:relative; z-index:0; isolation:isolate;
    width:100%; aspect-ratio: 2 / 1;
    border-radius:16px; overflow:hidden;
    border:1px solid var(--sand-dark);
    background:var(--sand-dark);
  }
  .ck-map-wrap.ck-map-addable { cursor:crosshair; }
  .ck-map-leaflet { position:absolute; inset:0; }
  .ck-map-wrap .leaflet-tooltip.ck-map-tooltip {
    background:rgba(26,58,74,0.85); color:var(--white); border:none;
    font-family:var(--font-body); font-size:0.72rem; letter-spacing:0.04em;
    padding:0.2rem 0.5rem; box-shadow:none;
  }
  .ck-map-wrap .leaflet-tooltip.ck-map-tooltip::before { display:none; }
  .ck-map-wrap .leaflet-tooltip.ck-map-pin-tooltip {
    background:var(--white); border:none; border-radius:10px;
    padding:0; width:200px; box-shadow:0 8px 24px rgba(0,0,0,0.25);
    white-space:normal; overflow:hidden;
  }
  .ck-map-wrap .leaflet-tooltip.ck-map-pin-tooltip::before { display:none; }
  .ck-map-pin-preview-img { width:100%; height:100px; object-fit:cover; display:block; }
  .ck-map-pin-preview-body { padding:0.6rem 0.75rem; }
  .ck-map-pin-preview-label {
    font-family:var(--font-display); font-size:1rem; color:var(--ocean);
    margin-bottom:0.2rem; line-height:1.2;
  }
  .ck-map-pin-preview-summary {
    font-size:0.75rem; color:var(--text-light); line-height:1.4;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
  }
  .ck-map-pin {
    width:18px; height:18px; border-radius:3px;
    border:2px solid var(--white);
    box-shadow:0 2px 8px rgba(0,0,0,0.35);
    cursor:pointer; transition: transform 0.2s;
    transform: rotate(45deg);
  }
  .ck-map-pin:hover { transform: rotate(45deg) scale(1.25); }
  .ck-map-offscreen {
    position:absolute; transform:translate(-50%,-50%);
    width:26px; height:26px; border-radius:50%;
    border:2px solid var(--white); color:var(--white);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.4); z-index:1000;
  }
  .ck-map-offscreen-arrow { font-size:0.65rem; line-height:1; }
  .ck-map-offscreen-count { font-size:0.55rem; line-height:1; margin-top:1px; }
  .ck-map-legend-diamond {
    width:12px; height:12px; border-radius:2px; transform:rotate(45deg); flex-shrink:0;
  }
  .ck-map-admin-bar {
    display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap;
  }
  .ck-map-hint {
    font-size:0.85rem; color:var(--text-light); font-style:italic;
  }
  .ck-map-filter-bar {
    display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:1.25rem;
  }
  .ck-map-filter-chip {
    display:flex; align-items:center; gap:0.5rem;
    padding:0.45rem 0.9rem; border-radius:20px;
    border:1px solid var(--sand-dark); background:white;
    font-family:var(--font-body); font-size:0.82rem; color:var(--text-light);
    cursor:pointer; transition: all 0.2s; opacity:0.45;
  }
  .ck-map-filter-chip.active { opacity:1; border-color:var(--ocean); color:var(--text); }
  .ck-map-filter-link {
    margin-left:0.15rem; color:var(--ocean); font-size:0.9rem;
    text-decoration:none; opacity:0.7;
  }
  .ck-map-filter-link:hover { opacity:1; }
  .ck-map-pin-list {
    margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--sand-dark);
  }
  .ck-map-pin-list h3 {
    font-family:var(--font-display); font-size:1.2rem; color:var(--ocean); margin-bottom:1rem;
  }
  .ck-map-pin-list-item {
    display:flex; align-items:center; gap:0.75rem;
    padding:0.6rem 0; border-bottom:1px solid var(--sand);
    font-size:0.9rem;
  }
  .ck-map-pin-list-item > span:nth-child(2) { flex:1; }
  .ck-map-jump-bar {
    display:flex; gap:0.9rem; flex-wrap:wrap; margin-bottom:1.5rem;
  }
  .ck-map-jump-chip {
    display:flex; flex-direction:column;
    width:160px; height:160px; padding:0; overflow:hidden;
    border-radius:12px; border:1px solid var(--sand-dark); background:white;
    cursor:pointer; transition: all 0.2s;
  }
  .ck-map-jump-chip:hover { border-color:var(--ocean); box-shadow:0 6px 16px rgba(0,0,0,0.1); transform:translateY(-2px); }
  .ck-map-jump-chip-img {
    width:100%; height:66.6667%; object-fit:cover; display:block; flex-shrink:0;
  }
  .ck-map-jump-chip-label {
    flex:1; display:flex; align-items:center; justify-content:center; gap:0.4rem;
    font-family:var(--font-body); font-size:0.82rem; color:var(--text);
    padding:0.3rem 0.5rem; text-align:center; line-height:1.2;
  }

  /* ── CATEGORY LIST + MAP LAYOUT ── */
  .ck-category-layout {
    display:grid; grid-template-columns: 1.3fr 1fr; gap:2.5rem; align-items:start;
  }
  @media(max-width:900px) { .ck-category-layout { grid-template-columns: 1fr; } }
  .ck-category-map-wrap { position:sticky; top:100px; }
  @media(max-width:900px) { .ck-category-map-wrap { position:static; } }
  .ck-map-wrap-sm { aspect-ratio: 4 / 5; }
  @media(max-width:900px) { .ck-map-wrap-sm { aspect-ratio: 16 / 10; } }
  .ck-map-empty-note {
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
    text-align:center; padding:1.5rem; pointer-events:none;
    font-size:0.85rem; color:var(--text-light); background:rgba(254,253,251,0.6);
  }

  /* ── AUTH MODAL ── */
  .ck-modal-overlay {
    position:fixed; inset:0; z-index:300;
    background:rgba(26,58,74,0.5);
    backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    padding:2rem;
  }
  .ck-modal {
    background:white; border-radius:16px;
    padding:2.5rem; max-width:440px; width:100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  .ck-modal-title {
    font-family:var(--font-display);
    font-size:1.8rem; color:var(--ocean);
    margin-bottom:0.5rem;
  }
  .ck-modal-subtitle {
    font-size:0.9rem; color:var(--text-light);
    margin-bottom:2rem; line-height:1.6;
  }
  .ck-modal-error {
    background:#fde8e8; color:#a33;
    padding:0.6rem 1rem; border-radius:8px;
    font-size:0.85rem; margin-bottom:1rem;
  }

  /* ── SITE GATE ── */
  .ck-gate {
    position:fixed; inset:0; z-index:500;
    background: var(--ocean);
    display:flex; align-items:center; justify-content:center;
    flex-direction:column; padding:2rem;
  }
  .ck-gate-title {
    font-family:var(--font-display);
    font-size: clamp(2.5rem,6vw,4.5rem);
    color:white; font-weight:300;
    letter-spacing:0.06em; margin-bottom:0.5rem;
    text-align:center;
  }
  .ck-gate-subtitle {
    color:rgba(255,255,255,0.5);
    font-size:0.85rem; letter-spacing:0.15em;
    text-transform:uppercase; margin-bottom:3rem;
    text-align:center;
  }
  .ck-gate-form {
    max-width:360px; width:100%; text-align:center;
  }
  .ck-gate-input {
    width:100%; padding:0.85rem 1.2rem;
    border:1px solid rgba(255,255,255,0.2);
    border-radius:8px; background:rgba(255,255,255,0.08);
    color:white; font-family:var(--font-body);
    font-size:1rem; text-align:center;
    letter-spacing:0.05em;
    transition: border-color 0.3s;
  }
  .ck-gate-input::placeholder { color:rgba(255,255,255,0.3); }
  .ck-gate-input:focus { outline:none; border-color:var(--gold); }
  .ck-gate-btn {
    margin-top:1rem; width:100%;
    padding:0.85rem; border:none; border-radius:8px;
    background:var(--gold); color:var(--ocean);
    font-family:var(--font-body); font-size:0.9rem;
    font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
    cursor:pointer; transition: all 0.3s;
  }
  .ck-gate-btn:hover { background:var(--gold-light); transform:translateY(-1px); }
  .ck-gate-error {
    color:var(--coral); font-size:0.85rem; margin-top:1rem;
  }

  /* ── FOOTER ── */
  .ck-footer {
    background:var(--ocean); color:rgba(255,255,255,0.6);
    padding:3rem 2rem; text-align:center;
  }
  .ck-footer-name {
    font-family:var(--font-display);
    font-size:1.4rem; color:white;
    margin-bottom:0.5rem; letter-spacing:0.05em;
  }
  .ck-footer p { font-size:0.85rem; line-height:1.8; }

  /* ── EDITOR ── */
  .ck-editor-actions {
    display:flex; gap:0.75rem; margin-bottom:2rem; flex-wrap:wrap;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(20px); }
    to { opacity:1; transform:translateY(0); }
  }
  .ck-animate { animation: fadeInUp 0.6s ease forwards; }
  .ck-animate-d1 { animation-delay:0.1s; opacity:0; }
  .ck-animate-d2 { animation-delay:0.2s; opacity:0; }
  .ck-animate-d3 { animation-delay:0.3s; opacity:0; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────

// Site Password Gate
function SiteGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="ck-gate">
      <h1 className="ck-gate-title">Chy Kernyk</h1>
      <p className="ck-gate-subtitle">A Cornish retreat on the Roseland Peninsula</p>
      <div className="ck-gate-form">
        <input
          className="ck-gate-input"
          type="password"
          placeholder="Enter password to continue"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(""); }}
          onKeyDown={async e => {
            if (e.key === "Enter") {
              if (await sha256Hex(pw) === SITE_PASSWORD_HASH) onUnlock();
              else setError("Incorrect password. Please try again.");
            }
          }}
          aria-label="Site password"
          autoFocus
        />
        <button className="ck-gate-btn" onClick={async () => {
          if (await sha256Hex(pw) === SITE_PASSWORD_HASH) onUnlock();
          else setError("Incorrect password. Please try again.");
        }}>Enter</button>
        {error && <p className="ck-gate-error">{error}</p>}
      </div>
    </div>
  );
}

// Admin Login Modal
function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const hash = await sha256Hex(password);
    const user = ADMIN_USERS.find(u => u.email === email && u.passwordHash === hash);
    if (user) {
      onLogin(user.email);
      onClose();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="ck-modal-overlay" onClick={onClose}>
      <div className="ck-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ck-modal-title">Admin Login</h2>
        <p className="ck-modal-subtitle">Sign in to manage blog posts and calendar availability.</p>
        {error && <div className="ck-modal-error">{error}</div>}
        <div className="ck-form-group">
          <label className="ck-label">Email</label>
          <input className="ck-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
        </div>
        <div className="ck-form-group">
          <label className="ck-label">Password</label>
          <input className="ck-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button className="ck-btn ck-btn-primary" onClick={handleLogin}>Sign In</button>
          <button className="ck-btn ck-btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// Navigation
function Nav({ page, setPage, isAdmin, onLoginClick, onLogout, mobileOpen, setMobileOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { id: "home", label: "Home" },
    { id: "around", label: "Explore" },
    { id: "blog", label: "Story" },
    { id: "visitors-book", label: "Visitors Book" },
    { id: "remedies", label: "Info" },
    { id: "gallery", label: "Gallery" },
    { id: "calendar", label: "Calendar" },
    { id: "contact", label: "Contact" },
  ];

  const navigate = (id) => { setPage(id); setMobileOpen(false); window.scrollTo(0, 0); };

  return (
    <>
      <nav className={`ck-nav ${scrolled ? "scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="ck-nav-inner">
          <div className="ck-logo" onClick={() => navigate("home")} role="button" tabIndex={0} aria-label="Go to home page">
            Chy <span>Kernyk</span>
          </div>
          <div className="ck-nav-links">
            {links.map(l => (
              <button key={l.id} className={`ck-nav-link ${page === l.id ? "active" : ""}`}
                onClick={() => navigate(l.id)}>{l.label}</button>
            ))}
          </div>
          <div className="ck-nav-auth">
            {isAdmin ? (
              <button className="ck-btn-logout" onClick={onLogout}>Logout</button>
            ) : (
              <button className="ck-btn-login" onClick={onLoginClick}>Admin</button>
            )}
          </div>
          <button className={`ck-hamburger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`ck-mobile-menu ${mobileOpen ? "open" : ""}`}>
        {links.map(l => (
          <button key={l.id} className={`ck-nav-link ${page === l.id ? "active" : ""}`}
            onClick={() => navigate(l.id)}>{l.label}</button>
        ))}
        <div className="ck-nav-auth-mobile">
          {isAdmin ? (
            <button className="ck-btn-logout" onClick={() => { onLogout(); setMobileOpen(false); }}>Logout</button>
          ) : (
            <button className="ck-btn-login" onClick={() => { onLoginClick(); setMobileOpen(false); }}>Admin Login</button>
          )}
        </div>
      </div>
    </>
  );
}

// Hero Carousel
function Hero({ setPage }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="ck-hero" aria-label="Hero carousel">
      {HERO_IMAGES.map((img, i) => (
        <div key={i} className={`ck-hero-slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img.url})` }} role="img" aria-label={img.caption} />
      ))}
      <div className="ck-hero-content">
        <h1 className="ck-hero-title ck-animate">Chy Kernyk</h1>
        <p className="ck-hero-subtitle ck-animate ck-animate-d1">Portscatho · Roseland Peninsula · Cornwall</p>
      </div>
      <div className="ck-hero-dots">
        {HERO_IMAGES.map((_, i) => (
          <button key={i} className={`ck-hero-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
      <div className="ck-hero-caption">{HERO_IMAGES[current].caption}</div>
    </section>
  );
}

// Page Header
function PageHeader({ title, subtitle, page, setPage, backTo, backLabel }) {
  return (
    <div className="ck-page-header">
      <div className="ck-page-header-inner" style={{ textAlign: "center" }}>
        <h1 className="ck-section-title">{title}</h1>
        {backTo ? (
          <button className="ck-back-link" onClick={() => { setPage(backTo); window.scrollTo(0, 0); }}>{backLabel || "Back"}</button>
        ) : (
          <div className="ck-section-line" />
        )}
        {subtitle && <p className="ck-section-desc">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────

// HOME
function HomePage({ setPage }) {
  return (
    <main>
      <Hero setPage={setPage} />
      <section className="ck-section" style={{ textAlign: "center" }}>
        <h2 className="ck-section-title" style={{ marginBottom: "1rem" }}>Welcome</h2>
        <div className="ck-section-line" style={{ margin: "0 auto 2rem" }} />
        <p style={{ fontSize: "1.1rem", lineHeight: 1.9, color: "var(--text-light)" }}>
          Perched above the beach in Portscatho, on Cornwall's beautiful Roseland Peninsula,
          Chy Kernyk offers an extraordinary coastal retreat. Wake to the sound of the sea,
          watch the light play across the water towards Gull Rock, and discover one of the
          most unspoilt corners of Cornwall.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
          <button className="ck-btn ck-btn-primary" onClick={() => { setPage("gallery"); window.scrollTo(0, 0); }}>View Gallery</button>
          <button className="ck-btn ck-btn-secondary" onClick={() => { setPage("calendar"); window.scrollTo(0, 0); }}>Check Availability</button>
        </div>
      </section>
    </main>
  );
}

// BLOG
function BlogPage({ setPage, posts, setPosts, isAdmin, setSubPage }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "" });

  const startEdit = (post) => {
    setEditing(post ? post.id : "new");
    setForm(post ? { title: post.title, excerpt: post.excerpt, content: post.content } : { title: "", excerpt: "", content: "" });
  };
  const savePost = () => {
    if (editing === "new") {
      const id = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setPosts([{ id, title: form.title, date: new Date().toISOString().split("T")[0], excerpt: form.excerpt, content: form.content }, ...posts]);
    } else {
      setPosts(posts.map(p => p.id === editing ? { ...p, ...form } : p));
    }
    setEditing(null);
  };
  const deletePost = (id) => {
    if (confirm("Delete this post?")) setPosts(posts.filter(p => p.id !== id));
  };

  if (editing) {
    return (
      <>
        <PageHeader title={editing === "new" ? "New Post" : "Edit Post"} setPage={setPage} backTo="blog" backLabel="Story" />
        <section className="ck-section" style={{ maxWidth: 800, paddingTop: "2rem" }}>
          <div className="ck-form-group">
            <label className="ck-label">Title</label>
            <input className="ck-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="ck-form-group">
            <label className="ck-label">Excerpt</label>
            <input className="ck-input" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div className="ck-form-group">
            <label className="ck-label">Content (use double newline for paragraphs)</label>
            <textarea className="ck-textarea" rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="ck-btn ck-btn-primary" onClick={savePost}>Save</button>
            <button className="ck-btn ck-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Our Story" subtitle="The journey of finding, designing, and building our Cornish retreat." setPage={setPage} backTo="home" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        {isAdmin && (
          <div className="ck-editor-actions">
            <button className="ck-btn ck-btn-primary ck-btn-sm" onClick={() => startEdit(null)}>+ New Post</button>
          </div>
        )}
        {posts.map(post => (
          <article key={post.id} className="ck-blog-post ck-animate" style={{ marginBottom: "2.5rem" }}>
            <p className="ck-blog-date">{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            <h2 className="ck-card-title" style={{ marginBottom: "0.5rem", cursor: "pointer" }}
              onClick={() => { setSubPage({ type: "blog-detail", id: post.id }); window.scrollTo(0, 0); }}>{post.title}</h2>
            <p className="ck-card-text">{post.excerpt}</p>
            <button className="ck-read-more" onClick={() => { setSubPage({ type: "blog-detail", id: post.id }); window.scrollTo(0, 0); }}>Read more →</button>
            {isAdmin && (
              <span style={{ marginLeft: "1rem" }}>
                <button className="ck-btn ck-btn-secondary ck-btn-sm" onClick={() => startEdit(post)} style={{ marginRight: "0.5rem" }}>Edit</button>
                <button className="ck-btn ck-btn-danger ck-btn-sm" onClick={() => deletePost(post.id)}>Delete</button>
              </span>
            )}
          </article>
        ))}
      </section>
    </>
  );
}

function BlogDetail({ post, setPage, setSubPage }) {
  if (!post) return <div className="ck-section"><p>Post not found.</p></div>;
  return (
    <>
      <div className="ck-page-header">
        <div className="ck-page-header-inner">
          <div className="ck-breadcrumb">
            <button onClick={() => { setSubPage(null); setPage("blog"); window.scrollTo(0, 0); }}>Story</button>
            <span> / {post.title}</span>
          </div>
        </div>
      </div>
      <div className="ck-detail-content">
        <p className="ck-blog-date">{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        <h1 className="ck-detail-title">{post.title}</h1>
        <div className="ck-detail-body">
          {post.content.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </>
  );
}

// GALLERY
function GalleryPage({ setPage }) {
  const [lightbox, setLightbox] = useState(null);
  return (
    <>
      <PageHeader title="Gallery" subtitle="Explore Chy Kernyk and the surrounding Roseland Peninsula." setPage={setPage} backTo="home" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-gallery-grid">
          {GALLERY_IMAGES.map(img => (
            <div key={img.id} className="ck-gallery-item" data-caption={img.caption}
              onClick={() => setLightbox(img)}>
              <img src={img.url} alt={img.caption} loading="lazy" />
            </div>
          ))}
        </div>
      </section>
      {lightbox && (
        <div className="ck-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-label="Image lightbox">
          <button className="ck-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close lightbox">×</button>
          <img src={lightbox.url} alt={lightbox.caption} />
          <div className="ck-lightbox-caption">{lightbox.caption}</div>
        </div>
      )}
    </>
  );
}

// VISITORS BOOK
const MAX_VISITOR_PHOTOS = 6;

function VisitorEntryForm({ onAdded }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;
    setSaving(true);
    setError("");
    try {
      const photo_urls = [];
      for (const file of files) {
        photo_urls.push(await uploadVisitorPhoto(file));
      }
      const saved = await createVisitorEntry({ name: name.trim(), entry_date: date, message: message.trim(), photo_urls });
      onAdded(saved);
      setName("");
      setMessage("");
      setFiles([]);
    } catch (err) {
      setError("Something went wrong saving your entry — please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ck-visitor-form">
      <h3 className="ck-visitor-form-title">Sign the Visitors Book</h3>
      {error && <p className="ck-modal-error">{error}</p>}
      <div className="ck-form-group">
        <label className="ck-label">Name</label>
        <input className="ck-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="ck-form-group">
        <label className="ck-label">Date</label>
        <input className="ck-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div className="ck-form-group">
        <label className="ck-label">Message</label>
        <textarea className="ck-textarea" value={message} onChange={e => setMessage(e.target.value)} placeholder="Share your memories from your stay…" />
      </div>
      <div className="ck-form-group">
        <label className="ck-label">Photos (optional, up to {MAX_VISITOR_PHOTOS})</label>
        <input type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files || []).slice(0, MAX_VISITOR_PHOTOS))} />
        {files.length > 0 && <p className="ck-visitor-form-filecount">{files.length} photo{files.length > 1 ? "s" : ""} selected</p>}
      </div>
      <button className="ck-btn ck-btn-primary" onClick={handleSubmit} disabled={saving || !name.trim() || !message.trim()}>
        {saving ? "Saving…" : "Add Entry"}
      </button>
    </div>
  );
}

function VisitorsBookPage({ setPage, isAdmin }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchVisitorEntries()
      .then(rows => { if (!cancelled) setEntries(rows); })
      .catch(() => { if (!cancelled) setError("Couldn't load the visitors book right now."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async entry => {
    if (!confirm(`Remove ${entry.name}'s entry?`)) return;
    await deleteVisitorEntry(entry.id);
    setEntries(prev => prev.filter(e => e.id !== entry.id));
  };

  return (
    <>
      <PageHeader title="Visitors Book" subtitle="A place for guests to share memories from their stay at Chy Kernyk." setPage={setPage} backTo="home" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <VisitorEntryForm onAdded={entry => setEntries(prev => [entry, ...prev])} />

        {loading && <p style={{ color: "var(--text-light)" }}>Loading entries…</p>}
        {error && <p className="ck-modal-error">{error}</p>}
        {!loading && entries.length === 0 && (
          <p style={{ color: "var(--text-light)", marginTop: "2rem" }}>No entries yet — be the first to sign the book!</p>
        )}

        <div className="ck-visitor-entries">
          {entries.map(entry => (
            <div key={entry.id} className="ck-visitor-entry">
              <div className="ck-visitor-entry-header">
                <span className="ck-visitor-entry-name">{entry.name}</span>
                <span className="ck-visitor-entry-date">
                  {new Date(entry.entry_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <p className="ck-visitor-entry-message">{entry.message}</p>
              {entry.photo_urls && entry.photo_urls.length > 0 && (
                <div className="ck-visitor-entry-photos">
                  {entry.photo_urls.map((url, i) => (
                    <img key={i} src={url} alt={`Photo ${i + 1} from ${entry.name}`} loading="lazy" onClick={() => setLightbox(url)} />
                  ))}
                </div>
              )}
              {isAdmin && (
                <button className="ck-btn ck-btn-danger ck-btn-sm" style={{ marginTop: "1rem" }} onClick={() => handleDelete(entry)}>Remove Entry</button>
              )}
            </div>
          ))}
        </div>
      </section>

      {lightbox && (
        <div className="ck-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-label="Image lightbox">
          <button className="ck-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close lightbox">×</button>
          <img src={lightbox} alt="" />
        </div>
      )}
    </>
  );
}

// FOOD
function FoodListPage({ setPage, setSubPage, foodType, linkType, title, subtitle }) {
  const places = FOOD_PLACES.filter(p => p.foodType === foodType);
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} setPage={setPage} backTo="around" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-category-layout">
          <div className="ck-grid">
            {places.map(place => (
              <div key={place.id} className="ck-card" onClick={() => { setSubPage({ type: "food-detail", id: place.id }); window.scrollTo(0, 0); }}>
                <div className="ck-card-img-wrap"><img className="ck-card-img" src={place.image} alt={place.name} loading="lazy" /></div>
                <div className="ck-card-body">
                  <p className="ck-card-meta">{place.location}</p>
                  <h3 className="ck-card-title">{place.name}</h3>
                  <p className="ck-card-text">{place.desc}</p>
                  <div className="ck-card-tags">
                    {place.tags.map(t => <span key={t} className="ck-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ck-category-map-wrap">
            <CategoryMap linkType={linkType} setPage={setPage} setSubPage={setSubPage} />
          </div>
        </div>
      </section>
    </>
  );
}

function EatingOutPage({ setPage, setSubPage }) {
  return (
    <FoodListPage
      setPage={setPage} setSubPage={setSubPage}
      foodType="eating" linkType="eating-out"
      title="Eating Out" subtitle="From beach cafés to fine dining — the Roseland and beyond offer extraordinary places to eat."
    />
  );
}

function BuyingFoodPage({ setPage, setSubPage }) {
  return (
    <FoodListPage
      setPage={setPage} setSubPage={setSubPage}
      foodType="buying" linkType="buying-food"
      title="Buying Food" subtitle="Farm shops, delis, and stores stocked with the very best Cornish produce."
    />
  );
}

function FoodDetail({ place, setPage, setSubPage }) {
  if (!place) return <div className="ck-section"><p>Place not found.</p></div>;
  const backTo = place.foodType === "eating" ? "eating-out" : "buying-food";
  const backLabel = place.foodType === "eating" ? "Eating Out" : "Buying Food";
  return (
    <>
      <img src={place.image} alt={place.name} className="ck-detail-hero" />
      <div className="ck-detail-content">
        <div className="ck-breadcrumb" style={{ marginBottom: "1rem" }}>
          <button onClick={() => { setSubPage(null); setPage(backTo); window.scrollTo(0, 0); }}>{backLabel}</button>
          <span> / {place.name}</span>
        </div>
        <h1 className="ck-detail-title">{place.name}</h1>
        <div className="ck-card-tags" style={{ marginBottom: "1.5rem" }}>
          {place.tags.map(t => <span key={t} className="ck-tag">{t}</span>)}
        </div>
        <div className="ck-detail-body"><p>{place.desc}</p></div>
        <div className="ck-detail-info">
          <h3>Location</h3>
          <p>{place.location}</p>
        </div>
      </div>
    </>
  );
}

// ACTIVITIES
function ActivityListPage({ setPage, setSubPage, items, linkType, title, subtitle }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} setPage={setPage} backTo="around" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-category-layout">
          <div className="ck-grid">
            {items.map(a => (
              <div key={a.id} className="ck-card" onClick={() => { setSubPage({ type: "activity-detail", id: a.id }); window.scrollTo(0, 0); }}>
                <div className="ck-card-img-wrap"><img className="ck-card-img" src={a.image} alt={a.name} loading="lazy" /></div>
                <div className="ck-card-body">
                  <h3 className="ck-card-title">{a.name}</h3>
                  <p className="ck-card-text">{a.desc}</p>
                  <div className="ck-card-tags">
                    {a.tags.map(t => <span key={t} className="ck-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ck-category-map-wrap">
            <CategoryMap linkType={linkType} setPage={setPage} setSubPage={setSubPage} />
          </div>
        </div>
      </section>
    </>
  );
}

function ActivitiesPage({ setPage, setSubPage }) {
  return (
    <ActivityListPage
      setPage={setPage} setSubPage={setSubPage}
      items={ACTIVITIES.filter(a => !a.category || a.id === "eden-project")} linkType="activity-detail"
      title="Days Out" subtitle="Adventures, culture, and coastline — there's something for everyone."
    />
  );
}

function GardensPage({ setPage, setSubPage }) {
  return (
    <ActivityListPage
      setPage={setPage} setSubPage={setSubPage}
      items={ACTIVITIES.filter(a => a.category === "garden")} linkType="garden"
      title="Gardens" subtitle="Cornwall's celebrated gardens — from lush lost valleys to otherworldly biomes."
    />
  );
}

function BeachesPage({ setPage, setSubPage }) {
  return (
    <ActivityListPage
      setPage={setPage} setSubPage={setSubPage}
      items={ACTIVITIES.filter(a => a.category === "beach")} linkType="beach"
      title="Beaches" subtitle="From sheltered coves to big Atlantic surf — the best beaches near and far."
    />
  );
}

function ActivityDetail({ activity, setPage, setSubPage }) {
  if (!activity) return <div className="ck-section"><p>Activity not found.</p></div>;
  const backTo = activity.category === "garden" ? "gardens" : activity.category === "beach" ? "beaches" : "activities";
  const backLabel = activity.category === "garden" ? "Gardens" : activity.category === "beach" ? "Beaches" : "Days Out";
  return (
    <>
      <img src={activity.image} alt={activity.name} className="ck-detail-hero" />
      <div className="ck-detail-content">
        <div className="ck-breadcrumb" style={{ marginBottom: "1rem" }}>
          <button onClick={() => { setSubPage(null); setPage(backTo); window.scrollTo(0, 0); }}>{backLabel}</button>
          <span> / {activity.name}</span>
        </div>
        <h1 className="ck-detail-title">{activity.name}</h1>
        <div className="ck-card-tags" style={{ marginBottom: "1.5rem" }}>
          {activity.tags.map(t => <span key={t} className="ck-tag">{t}</span>)}
        </div>
        <div className="ck-detail-body"><p>{activity.desc}</p></div>
      </div>
    </>
  );
}

// WALKS
function WalksPage({ setPage, setSubPage }) {
  return (
    <>
      <PageHeader title="Local Walks" subtitle="The Roseland Peninsula offers some of the finest coastal and countryside walking in Cornwall." setPage={setPage} backTo="around" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-category-layout">
          <div className="ck-grid">
            {WALKS.map(w => (
              <div key={w.id} className="ck-card" onClick={() => { setSubPage({ type: "walk-detail", id: w.id }); window.scrollTo(0, 0); }}>
                <div className="ck-card-img-wrap"><img className="ck-card-img" src={w.image} alt={w.name} loading="lazy" /></div>
                <div className="ck-card-body">
                  <h3 className="ck-card-title">{w.name}</h3>
                  <p className="ck-card-text">{w.desc}</p>
                  <div className="ck-card-tags">
                    <span className="ck-tag">{w.length}</span>
                    <span className="ck-tag">{w.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ck-category-map-wrap">
            <CategoryMap linkType="walk-detail" setPage={setPage} setSubPage={setSubPage} />
          </div>
        </div>
      </section>
    </>
  );
}

// Renders a Strava route using their embed widget (a placeholder div that
// strava-embeds.com's script scans for and replaces with an iframe). The
// script is re-appended on mount so it re-scans after client-side navigation.
function StravaRouteEmbed({ routeId }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://strava-embeds.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [routeId]);

  return (
    <div
      className="strava-embed-placeholder"
      data-embed-type="route"
      data-embed-id={routeId}
      data-style="standard"
      data-slippy="true"
    />
  );
}

function WalkDetail({ walk, setPage, setSubPage }) {
  if (!walk) return <div className="ck-section"><p>Walk not found.</p></div>;
  return (
    <>
      <img src={walk.image} alt={walk.name} className="ck-detail-hero" />
      <div className="ck-detail-content">
        <div className="ck-breadcrumb" style={{ marginBottom: "1rem" }}>
          <button onClick={() => { setSubPage(null); setPage("walks"); window.scrollTo(0, 0); }}>Walks</button>
          <span> / {walk.name}</span>
        </div>
        <h1 className="ck-detail-title">{walk.name}</h1>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <span className="ck-detail-badge">{walk.length}</span>
          <span className="ck-detail-badge">{walk.difficulty}</span>
        </div>
        <div className="ck-detail-body"><p>{walk.desc}</p></div>

        {/* Trail Map */}
        <div className="ck-detail-info" style={{ marginTop: "2rem" }}>
          <h3>Trail Map</h3>
          {walk.stravaRouteId ? (
            <div style={{ marginTop: "1rem" }}>
              <StravaRouteEmbed routeId={walk.stravaRouteId} />
            </div>
          ) : (
            <div style={{ width: "100%", height: 300, borderRadius: 8, overflow: "hidden", marginTop: "1rem", background: "var(--sand-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <iframe
                title={`Map for ${walk.name}`}
                width="100%" height="300" style={{ border: 0, borderRadius: 8 }}
                src={`https://www.google.com/maps/embed/v1/place?key=PLACEHOLDER&q=Portscatho,Cornwall,UK`}
                allowFullScreen loading="lazy"
                onError={e => e.target.style.display = "none"}
              />
            </div>
          )}
          <div style={{ marginTop: "1rem" }}>
            <a href={`/gpx/${walk.id}.gpx`} className="ck-btn ck-btn-secondary ck-btn-sm" style={{ textDecoration: "none" }} download>
              ↓ Download GPX Route
            </a>
          </div>
        </div>

        <div className="ck-detail-info">
          <h3>Parking</h3>
          <p>{walk.parking}</p>
        </div>
        <div className="ck-detail-info">
          <h3>Where to Eat</h3>
          <p>{walk.eating}</p>
        </div>
      </div>
    </>
  );
}

// AROUND & ABOUT
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Builds the hover-preview card (image + summary) shown for a pin.
function pinPreviewHTML(pin) {
  const type = PIN_TYPES[pin.link_type];
  const item = type && type.items.find(i => type.getId(i) === pin.link_id);
  const image = item && type.getImage ? type.getImage(item) : null;
  const summary = item && type.getSummary ? type.getSummary(item) : "";
  return `
    ${image ? `<img class="ck-map-pin-preview-img" src="${escapeHtml(image)}" alt="" />` : ""}
    <div class="ck-map-pin-preview-body">
      <div class="ck-map-pin-preview-label">${escapeHtml(pin.label)}</div>
      ${summary ? `<div class="ck-map-pin-preview-summary">${escapeHtml(summary)}</div>` : ""}
    </div>
  `;
}

// Groups off-screen pins into 8 compass directions and returns each
// group's angle (0 = north, clockwise) plus the pins in it.
function groupOffscreenPins(pins, bounds, center) {
  const buckets = {};
  pins.forEach(pin => {
    if (bounds.contains([pin.lat, pin.lng])) return;
    const dx = (pin.lng - center.lng) * Math.cos(center.lat * Math.PI / 180);
    const dy = pin.lat - center.lat;
    let angleDeg = Math.atan2(dx, dy) * 180 / Math.PI;
    if (angleDeg < 0) angleDeg += 360;
    const octant = Math.round(angleDeg / 45) % 8;
    if (!buckets[octant]) buckets[octant] = { angle: octant * 45, pins: [] };
    buckets[octant].pins.push(pin);
  });
  return Object.values(buckets);
}

// Simple line-drawing icons for each map category's jump-link button.
function CategoryIcon({ type, color, size = 22 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "walk-detail": // shoe
      return (
        <svg {...common}>
          <path d="M3 18h17a1 1 0 0 0 1-1v-.6c0-.9-.6-1.7-1.5-1.9l-2.7-.7a2 2 0 0 1-1.3-1L14.4 9c-.4-.8-1.2-1.3-2.1-1.3h-1a4 4 0 0 0-4 3.7L7 13l-2.8 1.4A2 2 0 0 0 3 16.2V17a1 1 0 0 0 0 1Z" />
          <path d="M9 14.3 12 13M12.6 12 15 10.7" />
        </svg>
      );
    case "activity-detail": // car
      return (
        <svg {...common}>
          <path d="M3 16v-3.2c0-.5.2-1 .6-1.3l2-1.8c.3-.3.7-.5 1.2-.6l2.3-.4c.6-.1 1.2-.1 1.8 0l2.3.4c.5.1.9.3 1.2.6l2 1.8c.4.3.6.8.6 1.3V16" />
          <path d="M3 16h16M3 16a1.5 1.5 0 0 0 3 0M16 16a1.5 1.5 0 0 0 3 0" />
          <path d="M6 11h10" />
        </svg>
      );
    case "garden": // tree
      return (
        <svg {...common}>
          <path d="M12 3 7.5 9.5H10L6.5 14H10l-3 4.5H12M12 3l4.5 6.5H14l3.5 4.5H14l3 4.5H12" />
          <path d="M12 18.5V22" />
        </svg>
      );
    case "eating-out": // menu
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M8 8h8M8 11.5h8M8 15h5" />
        </svg>
      );
    case "buying-food": // shopping bag
      return (
        <svg {...common}>
          <path d="M6 8h12l1 12.5a1 1 0 0 1-1 1.5H6a1 1 0 0 1-1-1.5L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "parkrun": // inverted parkrun-style tree of dots
      return (
        <svg {...common} fill={color} stroke="none">
          <g transform="translate(12,12) rotate(180) translate(-12,-12)">
            <path d="M11.3 3h1.4v6.5h-1.4z" />
            <circle cx="12" cy="9" r="1.4" />
            <circle cx="8.5" cy="11" r="1.2" />
            <circle cx="15.5" cy="11" r="1.2" />
            <circle cx="6" cy="14" r="1.1" />
            <circle cx="18" cy="14" r="1.1" />
            <circle cx="9.5" cy="14.5" r="1.1" />
            <circle cx="14.5" cy="14.5" r="1.1" />
            <circle cx="12" cy="16" r="1.2" />
            <circle cx="4.5" cy="17.5" r="1" />
            <circle cx="19.5" cy="17.5" r="1" />
            <circle cx="8" cy="18" r="1" />
            <circle cx="16" cy="18" r="1" />
            <circle cx="12" cy="19" r="1" />
          </g>
        </svg>
      );
    case "beach": // wave on a beach
      return (
        <svg {...common}>
          <path d="M2 10c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
          <path d="M2 14.5c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
          <path d="M2 20.5h20" strokeDasharray="0.5 3.2" />
        </svg>
      );
    default:
      return <span className="ck-map-legend-diamond" style={{ background: color }} />;
  }
}

function AroundAboutMap({ pins, addMode, onMapClick, onPinClick, activeTypes }) {
  const wrapRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const clickHandlerRef = useRef(onPinClick);
  clickHandlerRef.current = onPinClick;
  const [view, setView] = useState(null);

  // Initialize the map once.
  useEffect(() => {
    const map = L.map(wrapRef.current, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    map.fitBounds(L.latLngBounds(MAP_BOUNDS), { padding: [24, 24] });

    MAP_LANDMARKS.filter(l => l.isHome).forEach(l => {
      L.circleMarker([l.lat, l.lng], {
        radius: 7,
        color: "#fff", weight: 2,
        fillColor: "#d44",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(l.label, { permanent: true, direction: "top", offset: [0, -6], className: "ck-map-tooltip" });
    });

    const updateView = () => setView({ bounds: map.getBounds(), center: map.getCenter() });
    map.on("moveend", updateView);
    updateView();

    mapRef.current = map;
    return () => { map.off("moveend", updateView); map.remove(); mapRef.current = null; };
  }, []);

  // Toggle add-pin click handling.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = e => onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    if (addMode) map.on("click", handler);
    map.getContainer().style.cursor = addMode ? "crosshair" : "";
    return () => map.off("click", handler);
  }, [addMode, onMapClick]);

  // Sync pin markers whenever the visible pin list changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const visible = pins.filter(p => activeTypes[p.link_type] !== false);
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = visible.map(pin => {
      const type = PIN_TYPES[pin.link_type];
      const icon = L.divIcon({
        className: "",
        html: `<div class="ck-map-pin" style="background:${type ? type.color : "var(--stone)"}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);
      marker.bindTooltip(pinPreviewHTML(pin), { direction: "top", offset: [0, -12], className: "ck-map-pin-tooltip" });
      marker.on("click", () => clickHandlerRef.current(pin));
      return marker;
    });
  }, [pins, activeTypes]);

  const visiblePins = pins.filter(p => activeTypes[p.link_type] !== false);
  const offscreenGroups = view ? groupOffscreenPins(visiblePins, view.bounds, view.center) : [];

  return (
    <div className={`ck-map-wrap ${addMode ? "ck-map-addable" : ""}`}>
      <div ref={wrapRef} className="ck-map-leaflet" />
      {offscreenGroups.map(g => {
        const rad = g.angle * Math.PI / 180;
        const left = 50 + Math.sin(rad) * 43;
        const top = 50 - Math.cos(rad) * 43;
        const colors = [...new Set(g.pins.map(p => (PIN_TYPES[p.link_type] || {}).color || "var(--stone)"))];
        const bg = colors.length === 1 ? colors[0] : "var(--ocean)";
        return (
          <div
            key={g.angle}
            className="ck-map-offscreen"
            style={{ left: `${left}%`, top: `${top}%`, background: bg }}
            title={`${g.pins.length} pin${g.pins.length > 1 ? "s" : ""} this way — click to view`}
            onClick={() => {
              const map = mapRef.current;
              if (!map) return;
              map.panTo(L.latLngBounds(g.pins.map(p => [p.lat, p.lng])).getCenter());
            }}
          >
            <span className="ck-map-offscreen-arrow" style={{ transform: `rotate(${g.angle}deg)` }}>▲</span>
            <span className="ck-map-offscreen-count">{g.pins.length}</span>
          </div>
        );
      })}
    </div>
  );
}

// A smaller, read-only map for a single category's page (Walks, Things to
// Do, Eating Out, Buying Food, parkrun) — shows only pins for that category.
function CategoryMap({ linkType, setPage, setSubPage }) {
  const wrapRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPins()
      .then(rows => { if (!cancelled) setPins(rows.filter(p => p.link_type === linkType)); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [linkType]);

  useEffect(() => {
    const map = L.map(wrapRef.current, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    map.fitBounds(L.latLngBounds(MAP_BOUNDS), { padding: [16, 16] });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    const type = PIN_TYPES[linkType];
    markersRef.current = pins.map(pin => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="ck-map-pin" style="background:${type ? type.color : "var(--stone)"}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);
      marker.bindTooltip(pinPreviewHTML(pin), { direction: "top", offset: [0, -12], className: "ck-map-pin-tooltip" });
      marker.on("click", () => navigateToPin(pin, setPage, setSubPage));
      return marker;
    });
    if (pins.length > 0) {
      map.fitBounds(L.latLngBounds(pins.map(p => [p.lat, p.lng])), { padding: [30, 30], maxZoom: 14 });
    }
  }, [pins]);

  return (
    <div className="ck-map-wrap ck-map-wrap-sm">
      <div ref={wrapRef} className="ck-map-leaflet" />
      {!loading && pins.length === 0 && (
        <div className="ck-map-empty-note">No pins added for this category yet.</div>
      )}
    </div>
  );
}

function AddPinForm({ pos, onCancel, onSave }) {
  const [linkType, setLinkType] = useState("walk-detail");
  const [itemId, setItemId] = useState(() => {
    const t = PIN_TYPES["walk-detail"];
    return t.items[0] ? t.getId(t.items[0]) : "";
  });
  const [saving, setSaving] = useState(false);

  const type = PIN_TYPES[linkType];
  const items = type.items;

  const handleTypeChange = t => {
    setLinkType(t);
    const newType = PIN_TYPES[t];
    setItemId(newType.items[0] ? newType.getId(newType.items[0]) : "");
  };

  const handleSave = async () => {
    const item = items.find(i => type.getId(i) === itemId);
    if (!item) return;
    setSaving(true);
    try {
      await onSave({
        lat: pos.lat, lng: pos.lng,
        label: type.getLabel(item),
        category: type.label,
        link_type: linkType,
        link_id: itemId,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ck-modal-overlay" onClick={onCancel}>
      <div className="ck-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ck-modal-title">Add a Pin</h2>
        <p className="ck-modal-subtitle">Link this spot on the map to a walk, activity, garden, place to eat, place to buy food, or parkrun.</p>
        <div className="ck-form-group">
          <label className="ck-label">Category</label>
          <select className="ck-input" value={linkType} onChange={e => handleTypeChange(e.target.value)}>
            {Object.entries(PIN_TYPES).map(([key, t]) => (
              <option key={key} value={key}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="ck-form-group">
          <label className="ck-label">Links to</label>
          <select className="ck-input" value={itemId} onChange={e => setItemId(e.target.value)}>
            {items.map(i => (
              <option key={type.getId(i)} value={type.getId(i)}>{type.getLabel(i)}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button className="ck-btn ck-btn-primary" onClick={handleSave} disabled={saving || !itemId}>
            {saving ? "Saving…" : "Save Pin"}
          </button>
          <button className="ck-btn ck-btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AroundAboutPage({ setPage, setSubPage, isAdmin }) {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [pendingPos, setPendingPos] = useState(null);
  const [activeTypes, setActiveTypes] = useState(() =>
    Object.fromEntries(Object.keys(PIN_TYPES).map(k => [k, true]))
  );

  // Pick one random real (non-stock) photo per category, once per visit,
  // to illustrate that category's jump button. Some categories have a
  // fixed image instead of a random pick — set below.
  const jumpImages = useMemo(() => {
    const result = {};
    Object.entries(PIN_TYPES).forEach(([key, t]) => {
      if (!t.page) return;
      const candidates = (t.items || [])
        .map(i => (t.getImage ? t.getImage(i) : null))
        .filter(img => img && !String(img).includes("images.unsplash.com"));
      if (candidates.length > 0) {
        result[key] = candidates[Math.floor(Math.random() * candidates.length)];
      }
    });
    result["walk-detail"] = imgNareHead;
    result["activity-detail"] = imgEdenProject;
    result["garden"] = imgTrelissick;
    result["beach"] = imgTowanShellPicking;
    result["eating-out"] = imgTheStandard;
    return result;
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPins()
      .then(rows => { if (!cancelled) setPins(rows); })
      .catch(() => { if (!cancelled) setError("Couldn't load pins right now."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handlePinClick = pin => navigateToPin(pin, setPage, setSubPage);

  const handleSavePin = async data => {
    const saved = await createPin(data);
    setPins(prev => [...prev, saved]);
    setPendingPos(null);
  };

  const handleDeletePin = async pin => {
    if (!confirm(`Remove the "${pin.label}" pin?`)) return;
    await deletePinById(pin.id);
    setPins(prev => prev.filter(p => p.id !== pin.id));
  };

  return (
    <>
      <PageHeader title="Explore" setPage={setPage} backTo="home" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        {isAdmin && (
          <div className="ck-map-admin-bar">
            <button className={`ck-btn ${addMode ? "ck-btn-primary" : "ck-btn-secondary"} ck-btn-sm`} onClick={() => { setAddMode(!addMode); setPendingPos(null); }}>
              {addMode ? "Cancel Adding" : "+ Add Pin"}
            </button>
            {addMode && <span className="ck-map-hint">Click anywhere on the map to place a pin.</span>}
          </div>
        )}

        <div className="ck-map-jump-bar">
          {Object.entries(PIN_TYPES).filter(([, t]) => t.page).map(([key, t]) => (
            <button key={key} className="ck-map-jump-chip" onClick={() => { setPage(t.page); window.scrollTo(0, 0); }}>
              {jumpImages[key] ? (
                <img className="ck-map-jump-chip-img" src={jumpImages[key]} alt="" />
              ) : (
                <div className="ck-map-jump-chip-img ck-map-jump-chip-img-empty" style={{ background: t.color }} />
              )}
              <div className="ck-map-jump-chip-label">
                <CategoryIcon type={key} color={t.color} size={16} />
                {t.label}
              </div>
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "var(--text-light)" }}>Loading map…</p>}
        {error && <p className="ck-modal-error">{error}</p>}

        {!loading && (
          <AroundAboutMap
            pins={pins}
            addMode={addMode}
            onMapClick={setPendingPos}
            onPinClick={handlePinClick}
            activeTypes={activeTypes}
          />
        )}

        <div className="ck-map-filter-bar" style={{ marginTop: "1.5rem" }}>
          {Object.entries(PIN_TYPES).map(([key, t]) => (
            <button
              key={key}
              className={`ck-map-filter-chip ${activeTypes[key] ? "active" : ""}`}
              onClick={() => setActiveTypes(prev => ({ ...prev, [key]: !prev[key] }))}
            >
              <span className="ck-map-legend-diamond" style={{ background: t.color }} />
              {t.label}
            </button>
          ))}
        </div>

        <p className="ck-section-desc" style={{ marginTop: "1.5rem" }}>A map of the Roseland Peninsula — click a pin to explore, or jump straight to a category.</p>

        {isAdmin && pins.length > 0 && (
          <div className="ck-map-pin-list">
            <h3>Manage Pins</h3>
            {pins.map(pin => {
              const type = PIN_TYPES[pin.link_type];
              return (
                <div key={pin.id} className="ck-map-pin-list-item">
                  <span className="ck-map-legend-diamond" style={{ background: type ? type.color : "var(--stone)" }} />
                  <span>{pin.label} <span style={{ color: "var(--text-light)" }}>— {type ? type.label : pin.category}</span></span>
                  <button className="ck-btn ck-btn-danger ck-btn-sm" onClick={() => handleDeletePin(pin)}>Remove</button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {pendingPos && (
        <AddPinForm pos={pendingPos} onCancel={() => setPendingPos(null)} onSave={handleSavePin} />
      )}
    </>
  );
}

// PARKRUN
function ParkrunPage({ setPage, setSubPage }) {
  return (
    <>
      <PageHeader title="parkrun" subtitle="Wonderful parkruns within easy reach. Every Saturday at 9am, free, for everyone, forever." setPage={setPage} backTo="around" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-category-layout">
          <div>
            {PARKRUNS.map(pr => (
              <div key={pr.name} className="ck-parkrun-card">
                <a href={pr.url} target="_blank" rel="noopener noreferrer" className="ck-parkrun-link">{pr.name} parkrun ↗</a>
                <p style={{ fontSize: "0.92rem", color: "var(--text-light)", marginTop: "0.5rem", lineHeight: 1.7 }}>{pr.desc}</p>
              </div>
            ))}
          </div>
          <div className="ck-category-map-wrap">
            <CategoryMap linkType="parkrun" setPage={setPage} setSubPage={setSubPage} />
          </div>
        </div>
      </section>
    </>
  );
}

// REMEDIES
function RemediesPage({ setPage }) {
  return (
    <>
      <PageHeader title="Info" subtitle="Emergency contacts, maintenance details, and practical information for your stay." setPage={setPage} backTo="home" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        {REMEDIES.map(cat => (
          <div key={cat.category} className="ck-remedy-section">
            <h2 className="ck-remedy-title">{cat.category}</h2>
            {cat.items.map(item => (
              <div key={item.name} className="ck-remedy-item">
                <span className="ck-remedy-icon">{item.icon}</span>
                <div>
                  <div className="ck-remedy-name">{item.name}</div>
                  <div className="ck-remedy-detail">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}

// A simple Leaflet map centered on the property, with a single marker —
// used on the Contact page instead of an embedded Google Map.
function PropertyMap() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const map = L.map(wrapRef.current, { scrollWheelZoom: false })
      .setView([PROPERTY_LOCATION.lat, PROPERTY_LOCATION.lng], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    L.circleMarker([PROPERTY_LOCATION.lat, PROPERTY_LOCATION.lng], {
      radius: 8,
      color: "#fff", weight: 2,
      fillColor: "#d44",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindTooltip("Chy Kernyk", { permanent: true, direction: "top", offset: [0, -8], className: "ck-map-tooltip" });
    return () => map.remove();
  }, []);

  return <div ref={wrapRef} className="ck-map-leaflet" />;
}

// CONTACT
function ContactPage({ setPage }) {
  return (
    <>
      <PageHeader title="Contact & Location" subtitle="Find us on the Roseland Peninsula, overlooking the beach at Portscatho." setPage={setPage} backTo="home" />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-contact-grid">
          <div className="ck-map-container">
            <PropertyMap />
          </div>
          <div className="ck-contact-info">
            <div className="ck-contact-item">
              <h3>Address</h3>
              <p>Chy Kernyk<br />Portscatho<br />Truro, Cornwall<br />TR2 5DU</p>
            </div>
            <div className="ck-contact-item">
              <h3>What3Words</h3>
              <p><a href="https://w3w.co/latches.invisible.rope" target="_blank" rel="noopener noreferrer">///latches.invisible.rope</a></p>
            </div>
            <div className="ck-contact-item">
              <h3>Email</h3>
              <p><a href="mailto:contact@chykernyk.co.uk">contact@chykernyk.co.uk</a></p>
            </div>
            <div className="ck-contact-item">
              <h3>Getting Here</h3>
              <p>From the A390, take the A3078 towards St Mawes. Turn left at Trewithian towards Portscatho. The property is on the coastal road overlooking the beach.</p>
              <p style={{ marginTop: "0.5rem" }}>By public transport, catch a train to Truro and pick up the 50 bus. <a href="https://www.transportforcornwall.co.uk/services/TFCN/50" target="_blank" rel="noopener noreferrer">Timetable here</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Feast Night dates from https://hiddenhut.co.uk/pages/feast-nights
const FEAST_NIGHTS = new Set([
  "2026-05-20", "2026-05-26",
  "2026-06-19", "2026-06-24",
  "2026-07-04", "2026-07-21", "2026-07-24",
  "2026-08-14", "2026-08-21",
]);

// CALENDAR
function CalendarPage({ setPage, isAdmin }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState({
    "2026-04-10": "booked", "2026-04-11": "booked", "2026-04-12": "booked",
    "2026-04-13": "booked", "2026-04-14": "booked",
    "2026-04-25": "owner", "2026-04-26": "owner", "2026-04-27": "owner",
    "2026-07-01": "booked", "2026-07-02": "booked", "2026-07-03": "booked",
    "2026-07-04": "booked", "2026-07-05": "booked", "2026-07-06": "booked", "2026-07-07": "booked",
    "2026-08-15": "booked", "2026-08-16": "booked", "2026-08-17": "booked",
    "2026-08-18": "booked", "2026-08-19": "booked", "2026-08-20": "booked", "2026-08-21": "booked", "2026-08-22": "booked",
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const toggleDate = (dateStr) => {
    if (!isAdmin) return;
    const states = [undefined, "booked", "owner", "available"];
    const current = bookings[dateStr];
    const idx = states.indexOf(current);
    const next = states[(idx + 1) % states.length];
    if (next === undefined) {
      const newBookings = { ...bookings };
      delete newBookings[dateStr];
      setBookings(newBookings);
    } else {
      setBookings({ ...bookings, [dateStr]: next });
    }
  };

  const days = [];
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <>
      <PageHeader title="Availability"
        subtitle={isAdmin ? "Click on dates to cycle through: clear → booked → owner → available." : "Check when Chy Kernyk is available for your visit."}
        setPage={setPage} backTo="home" />
      <section className="ck-section" style={{ paddingTop: "1rem", maxWidth: 700 }}>
        <div className="ck-cal">
          <div className="ck-cal-header">
            <button className="ck-cal-nav" onClick={prevMonth} aria-label="Previous month">←</button>
            <h2 className="ck-cal-month">
              {currentMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </h2>
            <button className="ck-cal-nav" onClick={nextMonth} aria-label="Next month">→</button>
          </div>
          <div className="ck-cal-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div key={d} className="ck-cal-day-label">{d}</div>
            ))}
            {days.map((d, i) => {
              if (d === null) return <div key={`e${i}`} className="ck-cal-day empty" />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const status = bookings[dateStr] || "";
              const isToday = dateStr === todayStr;
              const isFeastNight = FEAST_NIGHTS.has(dateStr);
              return (
                <div key={dateStr}
                  className={`ck-cal-day ${status} ${isToday ? "today" : ""}`}
                  onClick={() => toggleDate(dateStr)}
                  role={isAdmin ? "button" : undefined}
                  aria-label={`${d} ${currentMonth.toLocaleDateString("en-GB", { month: "long" })} ${status || "available"}${isFeastNight ? ", Feast Night" : ""}`}
                >
                  {d}
                  {isFeastNight && <span className="ck-cal-day-star" title="Feast Night">★</span>}
                </div>
              );
            })}
          </div>
          <div className="ck-cal-legend">
            <div className="ck-cal-legend-item">
              <div className="ck-cal-legend-dot" style={{ background: "white", border: "1px solid var(--sand-dark)" }} />
              Available
            </div>
            <div className="ck-cal-legend-item">
              <div className="ck-cal-legend-dot" style={{ background: "#fde8e8" }} />
              Booked
            </div>
            <div className="ck-cal-legend-item">
              <div className="ck-cal-legend-dot" style={{ background: "#e8f0fd" }} />
              Owner
            </div>
            <div className="ck-cal-legend-item">
              <div className="ck-cal-legend-dot" style={{ background: "#e8f5e8" }} />
              Confirmed Available
            </div>
            <div className="ck-cal-legend-item">
              <span style={{ color: "var(--gold)" }}>★</span>
              Feast Night at The Hidden Hut
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Footer
function Footer() {
  return (
    <footer className="ck-footer">
      <div className="ck-footer-name">Chy Kernyk</div>
      <p>Portscatho · Roseland Peninsula · Cornwall · TR2 5DU</p>
      <p style={{ marginTop: "0.5rem" }}>contact@chykernyk.co.uk</p>
      <p style={{ marginTop: "1rem", fontSize: "0.75rem", opacity: 0.5 }}>© {new Date().getFullYear()} Chy Kernyk. All rights reserved.</p>
    </footer>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function App() {
  const [siteUnlocked, setSiteUnlocked] = useState(false);
  const [page, setPage] = useState("home");
  const [subPage, setSubPage] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [posts, setPosts] = useState(BLOG_POSTS);

  const isAdmin = !!adminUser;

  // Reset subpage when main page changes
  useEffect(() => { setSubPage(null); }, [page]);

  // Render sub-pages (detail views)
  if (subPage) {
    let content = null;
    if (subPage.type === "blog-detail") {
      const post = posts.find(p => p.id === subPage.id);
      content = <BlogDetail post={post} setPage={setPage} setSubPage={setSubPage} />;
    } else if (subPage.type === "food-detail") {
      const place = FOOD_PLACES.find(p => p.id === subPage.id);
      content = <FoodDetail place={place} setPage={setPage} setSubPage={setSubPage} />;
    } else if (subPage.type === "activity-detail") {
      const activity = ACTIVITIES.find(a => a.id === subPage.id);
      content = <ActivityDetail activity={activity} setPage={setPage} setSubPage={setSubPage} />;
    } else if (subPage.type === "walk-detail") {
      const walk = WALKS.find(w => w.id === subPage.id);
      content = <WalkDetail walk={walk} setPage={setPage} setSubPage={setSubPage} />;
    }

    if (content) {
      return (
        <div className="ck-app">
          <style>{CSS}</style>
          <Nav page={page} setPage={p => { setSubPage(null); setPage(p); }} isAdmin={isAdmin}
            onLoginClick={() => setShowLogin(true)} onLogout={() => setAdminUser(null)}
            mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          {content}
          <Footer />
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={setAdminUser} />}
        </div>
      );
    }
  }

  if (!siteUnlocked) {
    return (
      <div className="ck-app">
        <style>{CSS}</style>
        <SiteGate onUnlock={() => setSiteUnlocked(true)} />
      </div>
    );
  }

  const pageMap = {
    home: <HomePage setPage={setPage} />,
    blog: <BlogPage setPage={setPage} posts={posts} setPosts={setPosts} isAdmin={isAdmin} setSubPage={setSubPage} />,
    gallery: <GalleryPage setPage={setPage} />,
    "visitors-book": <VisitorsBookPage setPage={setPage} isAdmin={isAdmin} />,
    "eating-out": <EatingOutPage setPage={setPage} setSubPage={setSubPage} />,
    "buying-food": <BuyingFoodPage setPage={setPage} setSubPage={setSubPage} />,
    activities: <ActivitiesPage setPage={setPage} setSubPage={setSubPage} />,
    gardens: <GardensPage setPage={setPage} setSubPage={setSubPage} />,
    beaches: <BeachesPage setPage={setPage} setSubPage={setSubPage} />,
    walks: <WalksPage setPage={setPage} setSubPage={setSubPage} />,
    around: <AroundAboutPage setPage={setPage} setSubPage={setSubPage} isAdmin={isAdmin} />,
    parkrun: <ParkrunPage setPage={setPage} setSubPage={setSubPage} />,
    calendar: <CalendarPage setPage={setPage} isAdmin={isAdmin} />,
    remedies: <RemediesPage setPage={setPage} />,
    contact: <ContactPage setPage={setPage} />,
  };

  return (
    <div className="ck-app">
      <style>{CSS}</style>
      <Nav page={page} setPage={setPage} isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)} onLogout={() => setAdminUser(null)}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {pageMap[page] || <HomePage setPage={setPage} />}
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={setAdminUser} />}
    </div>
  );
}
