<?php
/**
 * Template Name: Suburb Profile Detail Page
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package WordPress
 * @subpackage Twenty_Eleven
 * @since Twenty Eleven 1.0
 */

get_header(); ?>


<!-- page row -->
<div id="content">
    <div class="span8">
        <div class="row-fluid">
        <?php
            $permalink = pods_url_variable('last');
            $suburb = pods('suburb_profile',$permalink);
            $custom_area_name = ''; // set this to different are name which is more efficient towards google search
            $unique_id = $permalink . '-map';
            $lat = $suburb->display('lat');
            $lng = $suburb->display('lng');
            if ($custom_area_name == '') {
            $area_name = $suburb->display('name');
            }else{
                $area_name = $custom_area_name;
            }
        ?>
            <div class="gmap">
            <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAif4dCuu1eQEvD5YQoXeyiC8ILzzC9lPY&libraries=places&sensor=false"></script>
                <script type="text/javascript">


    var map; // global map object
    var suburb;
    var map_school;
    var result_pool = {};
    var map_shop;
    var map_transport;
    var custom = {};
    var school;
    var shop;
    var transport;
    // global pool arrays..
    var info_pool = {};
    var detail_pool = {};
    var marker_pool = {};
    var content_pool = {};
    function initialize() {
        suburb = new google.maps.LatLng(<?php echo $lat; ?>,<?php echo $lng; ?>); // global latlng object...
          var mapOptions = {
            zoom: 14,
            center: suburb,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          map = new google.maps.Map(document.getElementById("<?php echo $unique_id; ?>"), mapOptions);
    }
    function initialize_custom_map(types) {
        var rand = Math.floor(Math.random()*10000001);
        var keyword = types; // you can change this depending what school you searching for in current suburb
        // build up request for place
        if (typeof keyword != 'string') {
            var request = {
                location: suburb,
                radius: '2500',
                types: keyword
            };
        }else {
            var request = {
                location: suburb,
                radius: '2500',
                types: [keyword]
            };
        }
        custom['service'+rand] = new google.maps.places.PlacesService(map);
        custom['service'+rand].nearbySearch(request, search_callback);
    }
    function search_callback(results, status) {
            // callback functions to handle school location responses...
        if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            alert('over limit');
        }
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var rand = Math.floor(Math.random()*10000001);
              result_pool['result'+rand] = results[i];
              var _reference = {
                  "reference": result_pool['result'+rand].reference
              }
              //access details;
              detail_pool['detail'+rand] = new google.maps.places.PlacesService(map);
              detail_pool['detail'+rand].getDetails(_reference,detail_callback);
            }

          }
    }

    function detail_callback(place,status) {
        var _rand = Math.floor(Math.random()*10000001);  // internal random token for details..
        if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            console.log('over limit in detail callback... ');
        }
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log(_rand);
          var place_name = place.name;
          var address = place.formatted_address;
          var phone = place.formatted_phone_number;
          if (phone == undefined) {
              phone = 'Not Available';
          }
          var point = place.geometry.location;
          var gallery = place.photos;
          var website = place.website;
          var thistype = place.types;
          content_pool['content'+_rand] = '<div class="infowindow">';
          content_pool['content'+_rand] += '<div class="row-fluid">';
          content_pool['content'+_rand] += '  <h6>';
          content_pool['content'+_rand] += place_name;
          content_pool['content'+_rand] += '    </h6>';
          content_pool['content'+_rand] += '  <h6>';
          content_pool['content'+_rand] += 'Ph: ' + phone;
          content_pool['content'+_rand] += '  </h6>';
          content_pool['content'+_rand] += '  <h6>';
          content_pool['content'+_rand] += address;
          content_pool['content'+_rand] += '  </h6>';
          content_pool['content'+_rand] += '</div>';
          content_pool['content'+_rand] += '</div>';
         // console.log(content_pool['content'+rand]);
          // info windows...
         info_pool['info'+_rand] = new google.maps.InfoWindow({
               content: content_pool['content'+_rand]
         });
        // console.log(info_pool['info'+rand]);
         // markers...
         for (var i=0; i<thistype.length; i++) {
             if (thistype[i] == 'bus_station') {
                 var marker_icon = 'http://www.davidhackney.com.au/wp-content/uploads/2013/06/bus.png';
                 break;
             }
             if (thistype[i] == 'train_station') {
                 var marker_icon = 'http://www.davidhackney.com.au/wp-content/uploads/2013/06/train.png';
                 break;
             }
             if (thistype[i] == 'pet_store' || thistype[i] == 'furniture_store' || thistype[i] == 'bicycle_store' || thistype[i] == 'shoe_store'
             || thistype[i] == 'shopping_mall') {
                 var marker_icon = 'http://www.davidhackney.com.au/wp-content/uploads/2013/06/shop_open.png';
                 break;
             }
             if (thistype[i] == 'school') {
                 var marker_icon = 'http://www.davidhackney.com.au/wp-content/uploads/2013/06/education.png';
                 break;
             }
         }
         marker_pool['marker'+_rand] = new google.maps.Marker({
              position: point,
              map: map,
              title:place_name,
              icon: marker_icon
          });
          // binding
          var innerKey = 'info' + _rand;
            google.maps.event.addListener(marker_pool['marker'+_rand], 'click', function(innerKey) {
               return function() {
                   for (var key in info_pool) {
                       info_pool[key].close();
                   }
                   info_pool[innerKey].open(map,this);
               }// bind the content to event listner,...
           }(innerKey));
        }
    }


                </script>
            </div>
            <div id="<?php echo $unique_id; ?>" class="suburb-map span12">
                <!--Default map area....-->
            </div>
        </div>

        
    </div>
    <div class="span4">
        <?php
         //  if (is_front_page()){
                 get_sidebar();
            //}
        ?>

    </div>
</div>

<script type="text/javascript">
    jQuery(document).ready(function(){
        // generating all maps on this detail page...
        initialize(); // default parent map
      //  initialize_custom_map('school');
      setTimeout(function(){
          initialize_custom_map(['school','convenience_store','pet_store','furniture_store','bicycle_store','shoe_store','shopping_mall']);
      },2000)
    });
</script>
<?php get_footer(); ?>
