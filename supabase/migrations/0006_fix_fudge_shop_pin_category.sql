-- The St Mawes Fudge Shop pin was added with link_type "eating-out" and
-- category "Eating Out", but the shop is a Buying Food item
-- (FOOD_PLACES id "st-mawes-fudge-shop" has foodType "buying"). This left
-- it invisible on the Buying Food page's map (which filters pins by
-- link_type = "buying-food") while showing up under Eating Out instead.
update public.pins
set link_type = 'buying-food', category = 'Buying Food'
where link_type = 'eating-out' and link_id = 'st-mawes-fudge-shop';
