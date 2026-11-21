/* Countries (name|dial code) and city lists used by the Join us form.
   Countries without a city list fall back to a free-text city field.
   Add more lists to GEO.cities using the exact country name. */
(function () {
  var raw = [
'Afghanistan|93','Albania|355','Algeria|213','Andorra|376','Angola|244','Antigua and Barbuda|1268','Argentina|54','Armenia|374','Australia|61','Austria|43','Azerbaijan|994','Bahamas|1242','Bahrain|973','Bangladesh|880','Barbados|1246','Belarus|375','Belgium|32','Belize|501','Benin|229','Bhutan|975','Bolivia|591','Bosnia and Herzegovina|387','Botswana|267','Brazil|55','Brunei|673','Bulgaria|359','Burkina Faso|226','Burundi|257','Cabo Verde|238','Cambodia|855','Cameroon|237','Canada|1','Central African Republic|236','Chad|235','Chile|56','China|86','Colombia|57','Comoros|269','Congo (Republic)|242','Congo (Democratic Republic)|243','Costa Rica|506','Côte d’Ivoire|225','Croatia|385','Cuba|53','Cyprus|357','Czechia|420','Denmark|45','Djibouti|253','Dominica|1767','Dominican Republic|1','Ecuador|593','Egypt|20','El Salvador|503','Equatorial Guinea|240','Eritrea|291','Estonia|372','Eswatini|268','Ethiopia|251','Fiji|679','Finland|358','France|33','Gabon|241','Gambia|220','Georgia|995','Germany|49','Ghana|233','Greece|30','Grenada|1473','Guatemala|502','Guinea|224','Guinea-Bissau|245','Guyana|592','Haiti|509','Honduras|504','Hong Kong|852','Hungary|36','Iceland|354','India|91','Indonesia|62','Iran|98','Iraq|964','Ireland|353','Italy|39','Jamaica|1876','Japan|81','Jordan|962','Kazakhstan|7','Kenya|254','Kiribati|686','Kosovo|383','Kuwait|965','Kyrgyzstan|996','Laos|856','Latvia|371','Lebanon|961','Lesotho|266','Liberia|231','Libya|218','Liechtenstein|423','Lithuania|370','Luxembourg|352','Macau|853','Madagascar|261','Malawi|265','Malaysia|60','Maldives|960','Mali|223','Malta|356','Marshall Islands|692','Mauritania|222','Mauritius|230','Mexico|52','Micronesia|691','Moldova|373','Monaco|377','Mongolia|976','Montenegro|382','Morocco|212','Mozambique|258','Myanmar|95','Namibia|264','Nauru|674','Nepal|977','Netherlands|31','New Zealand|64','Nicaragua|505','Niger|227','Nigeria|234','North Korea|850','North Macedonia|389','Norway|47','Oman|968','Pakistan|92','Palau|680','Palestine|970','Panama|507','Papua New Guinea|675','Paraguay|595','Peru|51','Philippines|63','Poland|48','Portugal|351','Qatar|974','Romania|40','Russia|7','Rwanda|250','Saint Kitts and Nevis|1869','Saint Lucia|1758','Saint Vincent and the Grenadines|1784','Samoa|685','San Marino|378','São Tomé and Príncipe|239','Saudi Arabia|966','Senegal|221','Serbia|381','Seychelles|248','Sierra Leone|232','Singapore|65','Slovakia|421','Slovenia|386','Solomon Islands|677','Somalia|252','South Africa|27','South Korea|82','South Sudan|211','Spain|34','Sri Lanka|94','Sudan|249','Suriname|597','Sweden|46','Switzerland|41','Syria|963','Taiwan|886','Tajikistan|992','Tanzania|255','Thailand|66','Timor-Leste|670','Togo|228','Tonga|676','Trinidad and Tobago|1868','Tunisia|216','Turkey|90','Turkmenistan|993','Tuvalu|688','Uganda|256','Ukraine|380','United Arab Emirates|971','United Kingdom|44','United States|1','Uruguay|598','Uzbekistan|998','Vanuatu|678','Vatican City|379','Venezuela|58','Vietnam|84','Yemen|967','Zambia|260','Zimbabwe|263'
  ];
  var cities = {
'Saudi Arabia':'Riyadh,Jeddah,Makkah,Madinah,Dammam,Al Khobar,Dhahran,Jubail,Qatif,Al Hofuf,Al Mubarraz,Ras Tanura,Al Khafji,Hafar Al-Batin,Taif,Tabuk,Buraydah,Unaizah,Ar Rass,Hail,Abha,Khamis Mushait,Najran,Jazan,Abu Arish,Sabya,Yanbu,Rabigh,Al Baha,Bisha,Sakaka,Arar,Rafha,Turaif,Al Qurayyat,Duba,Al Wajh,Umluj,Al Ula,Tayma,Al Kharj,Al Majmaah,Al Zulfi,Shaqra,Dawadmi,Al Dilam,Wadi ad-Dawasir,Sharurah,Al Qunfudhah,Al Lith,Hotat Bani Tamim',
'United Arab Emirates':'Dubai,Abu Dhabi,Sharjah,Ajman,Ras Al Khaimah,Fujairah,Umm Al Quwain,Al Ain,Khor Fakkan,Dibba',
'Qatar':'Doha,Al Rayyan,Al Wakrah,Al Khor,Umm Salal,Al Daayen,Lusail,Mesaieed,Dukhan,Al Shamal',
'Kuwait':'Kuwait City,Hawalli,Salmiya,Farwaniya,Jahra,Ahmadi,Fahaheel,Sabah Al Salem',
'Bahrain':'Manama,Riffa,Muharraq,Hamad Town,Isa Town,Sitra,Budaiya',
'Oman':'Muscat,Seeb,Salalah,Sohar,Nizwa,Sur,Ibri,Barka,Rustaq',
'Egypt':'Cairo,Alexandria,Giza,Shubra El Kheima,Port Said,Suez,Luxor,Aswan,Mansoura,Tanta,Asyut,Ismailia,Faiyum,Zagazig,Damietta,Hurghada,Sharm El Sheikh',
'Jordan':'Amman,Zarqa,Irbid,Aqaba,Salt,Madaba,Jerash,Karak',
'Lebanon':'Beirut,Tripoli,Sidon,Tyre,Zahle,Baalbek',
'Syria':'Damascus,Aleppo,Homs,Latakia,Hama,Tartus',
'Iraq':'Baghdad,Basra,Mosul,Erbil,Najaf,Karbala,Sulaymaniyah,Kirkuk',
'Yemen':'Sanaa,Aden,Taiz,Hodeidah,Ibb,Mukalla',
'Palestine':'Gaza,Ramallah,Hebron,Nablus,Bethlehem,Jenin',
'Sudan':'Khartoum,Omdurman,Port Sudan,Kassala,Nyala,El Obeid',
'Libya':'Tripoli,Benghazi,Misrata,Sabha',
'Morocco':'Casablanca,Rabat,Marrakesh,Fes,Tangier,Agadir',
'Tunisia':'Tunis,Sfax,Sousse,Kairouan',
'Algeria':'Algiers,Oran,Constantine,Annaba',
'India':'Mumbai,Delhi,Bengaluru,Hyderabad,Chennai,Kolkata,Pune,Ahmedabad,Kochi,Thiruvananthapuram,Kozhikode,Jaipur,Lucknow,Chandigarh',
'Pakistan':'Karachi,Lahore,Islamabad,Rawalpindi,Faisalabad,Peshawar,Multan,Quetta',
'Bangladesh':'Dhaka,Chittagong,Sylhet,Khulna,Rajshahi',
'Sri Lanka':'Colombo,Kandy,Galle,Jaffna',
'Nepal':'Kathmandu,Pokhara,Lalitpur,Biratnagar',
'Philippines':'Manila,Quezon City,Makati,Pasig,Taguig,Cebu City,Davao City,Cagayan de Oro,Iloilo City,Bacolod,Baguio,Zamboanga City',
'Indonesia':'Jakarta,Surabaya,Bandung,Medan,Semarang',
'Turkey':'Istanbul,Ankara,Izmir,Bursa,Antalya',
'United Kingdom':'London,Manchester,Birmingham,Glasgow,Liverpool',
'United States':'New York,Los Angeles,Chicago,Houston,Washington D.C.',
'Nigeria':'Lagos,Abuja,Kano',
'Kenya':'Nairobi,Mombasa',
'Ethiopia':'Addis Ababa'
  };
  var out = {};
  Object.keys(cities).forEach(function (k) { out[k] = cities[k].split(','); });
  window.GEO = {
    countries: raw.map(function (r) { var p = r.split('|'); return { name: p[0], dial: p[1] }; }),
    cities: out
  };
})();
