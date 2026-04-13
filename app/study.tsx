import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const QUESTION_DATA: Record<string, any[]> = {
  Animals: [
    { q: "Largest land animal?", options: ["Lion", "Elephant", "Giraffe", "Hippo"], correct: 1 },
    { q: "Bird that cannot fly?", options: ["Eagle", "Parrot", "Ostrich", "Sparrow"], correct: 2 },
    { q: "Fastest land animal?", options: ["Cheetah", "Leopard", "Tiger", "Horse"], correct: 0 },
    { q: "How many hearts does an octopus have?", options: ["1", "2", "3", "4"], correct: 2 },
    { q: "A 'doe' is what kind of animal?", options: ["Deer", "Rabbit", "Horse", "Pig"], correct: 0 },
    { q: "What is a group of lions called?", options: ["Pack", "Herd", "Pride", "Flock"], correct: 2 },
    { q: "Only mammal capable of true flight?", options: ["Squirrel", "Bat", "Eagle", "Ostrich"], correct: 1 },
    { q: "How many legs does a spider have?", options: ["6", "8", "10", "12"], correct: 1 },
    { q: "What is a baby kangaroo called?", options: ["Cub", "Joey", "Calf", "Puppy"], correct: 1 },
    { q: "Largest shark species?", options: ["Great White", "Hammerhead", "Whale Shark", "Bull Shark"], correct: 2 },
    { q: "Which bird symbolizes peace?", options: ["Raven", "Dove", "Eagle", "Robin"], correct: 1 },
    { q: "Continent with no bees?", options: ["Australia", "Antarctica", "Africa", "Asia"], correct: 1 },
    { q: "Color of a polar bear's skin?", options: ["White", "Pink", "Black", "Grey"], correct: 2 },
    { q: "Tallest animal in the world?", options: ["Elephant", "Giraffe", "Moose", "Ostrich"], correct: 1 },
    { q: "A group of crows is called?", options: ["A murder", "A flock", "A pack", "A gang"], correct: 0 },
    { q: "Which animal never sleeps?", options: ["Bullfrog", "Shark", "Ant", "Bee"], correct: 0 },
    { q: "Natural food of pandas?", options: ["Grass", "Bamboo", "Fish", "Fruit"], correct: 1 },
    { q: "How many stomachs does a cow have?", options: ["1", "2", "3", "4"], correct: 3 },
    { q: "Largest primate in the world?", options: ["Chimp", "Orangutan", "Gorilla", "Baboon"], correct: 2 },
    { q: "Which bird can fly backwards?", options: ["Hummingbird", "Parrot", "Swallow", "Pigeon"], correct: 0 },
  ],
  Planets: [
    { q: "The Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
    { q: "Largest planet?", options: ["Earth", "Neptune", "Jupiter", "Saturn"], correct: 2 },
    { q: "Planet closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], correct: 1 },
    { q: "Planet with the most rings?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correct: 1 },
    { q: "The 'Morning Star' is?", options: ["Mars", "Venus", "Mercury", "Jupiter"], correct: 1 },
    { q: "Known as the Blue Giant?", options: ["Uranus", "Neptune", "Jupiter", "Earth"], correct: 1 },
    { q: "Our galaxy name?", options: ["Andromeda", "Milky Way", "Sombrero", "M81"], correct: 1 },
    { q: "Famous for Great Red Spot?", options: ["Mars", "Saturn", "Jupiter", "Venus"], correct: 2 },
    { q: "How many moons does Mars have?", options: ["1", "2", "50", "0"], correct: 1 },
    { q: "Planet that rotates on its side?", options: ["Uranus", "Neptune", "Saturn", "Venus"], correct: 0 },
    { q: "Hottest planet?", options: ["Mercury", "Mars", "Venus", "Jupiter"], correct: 2 },
    { q: "Reclassified as dwarf in 2006?", options: ["Eris", "Pluto", "Ceres", "Makemake"], correct: 1 },
    { q: "Earth's 'Twin'?", options: ["Mars", "Venus", "Mercury", "Neptune"], correct: 1 },
    { q: "Smallest planet?", options: ["Mercury", "Mars", "Venus", "Pluto"], correct: 0 },
    { q: "How many planets total?", options: ["7", "8", "9", "10"], correct: 1 },
    { q: "Day longer than its year?", options: ["Mars", "Venus", "Mercury", "Jupiter"], correct: 1 },
    { q: "Main gas in Jupiter?", options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon"], correct: 2 },
    { q: "Named after God of War?", options: ["Mars", "Jupiter", "Saturn", "Mercury"], correct: 0 },
    { q: "Ganymede is a moon of?", options: ["Saturn", "Jupiter", "Uranus", "Neptune"], correct: 1 },
    { q: "Titan is a moon of?", options: ["Jupiter", "Saturn", "Mars", "Earth"], correct: 1 },
  ],
  Science: [
    { q: "H in H2O?", options: ["Helium", "Hydrogen", "Hafnium", "Hydrate"], correct: 1 },
    { q: "Boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1 },
    { q: "Hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Quartz"], correct: 2 },
    { q: "Powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], correct: 2 },
    { q: "Closest star to Earth?", options: ["Proxima", "Sirius", "Sun", "Vega"], correct: 2 },
    { q: "Body's largest organ?", options: ["Liver", "Heart", "Skin", "Lungs"], correct: 2 },
    { q: "Gas plants absorb?", options: ["Oxygen", "Nitrogen", "CO2", "Hydrogen"], correct: 2 },
    { q: "Travels fastest?", options: ["Sound", "Light", "Electricity", "Wind"], correct: 1 },
    { q: "Symbol for Gold?", options: ["Gd", "Ag", "Au", "Fe"], correct: 2 },
    { q: "Main gas in air?", options: ["Oxygen", "Nitrogen", "Carbon", "Argon"], correct: 1 },
    { q: "Study of living things?", options: ["Physics", "Chemistry", "Biology", "Geology"], correct: 2 },
    { q: "Common name for NaCl?", options: ["Sugar", "Salt", "Soda", "Bleach"], correct: 1 },
    { q: "Center of an atom?", options: ["Electron", "Proton", "Nucleus", "Orbit"], correct: 2 },
    { q: "State of matter is steam?", options: ["Solid", "Liquid", "Gas", "Plasma"], correct: 2 },
    { q: "Force opposing motion?", options: ["Gravity", "Friction", "Inertia", "Velocity"], correct: 1 },
    { q: "How many bones in adult?", options: ["200", "206", "212", "250"], correct: 1 },
    { q: "Process plants make food?", options: ["Respiration", "Digestion", "Photosynthesis", "Osmosis"], correct: 2 },
    { q: "Melting point of ice?", options: ["0°C", "10°C", "32°C", "100°C"], correct: 0 },
    { q: "First element in Periodic Table?", options: ["Helium", "Hydrogen", "Oxygen", "Carbon"], correct: 1 },
    { q: "Unit of electrical resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 2 },
  ],
  History: [
    { q: "First President of USA?", options: ["Lincoln", "Washington", "Jefferson", "Adams"], correct: 1 },
    { q: "Who painted Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso", "Monet"], correct: 1 },
    { q: "Year WWII ended?", options: ["1940", "1942", "1945", "1950"], correct: 2 },
    { q: "Ancient Pyramids location?", options: ["Rome", "Greece", "Egypt", "Mexico"], correct: 2 },
    { q: "Discovered America 1492?", options: ["Magellan", "Cook", "Columbus", "Vespucci"], correct: 2 },
    { q: "First man on Moon?", options: ["Gagarin", "Armstrong", "Aldrin", "Glenn"], correct: 1 },
    { q: "French leader 'Little Corporal'?", options: ["Louis XIV", "Napoleon", "De Gaulle", "Robespierre"], correct: 1 },
    { q: "City destroyed by Vesuvius?", options: ["Rome", "Pompeii", "Athens", "Carthage"], correct: 1 },
    { q: "Empire of Julius Caesar?", options: ["Greek", "Roman", "British", "Persian"], correct: 1 },
    { q: "Inventor of Lightbulb?", options: ["Tesla", "Edison", "Bell", "Newton"], correct: 1 },
    { q: "Civil Rights leader 'Dream' speech?", options: ["Malcom X", "MLK Jr", "Rosa Parks", "Mandela"], correct: 1 },
    { q: "Ship that sank in 1912?", options: ["Britannic", "Olympic", "Titanic", "Lusitania"], correct: 2 },
    { q: "Wall that fell in 1989?", options: ["China", "Berlin", "Roman", "Hadrian"], correct: 1 },
    { q: "Wrote 'Romeo and Juliet'?", options: ["Dickens", "Shakespeare", "Twain", "Homer"], correct: 1 },
    { q: "Country of the Samurai?", options: ["China", "Korea", "Japan", "Thailand"], correct: 2 },
    { q: "Queen of Egypt with Caesar?", options: ["Nefertiti", "Cleopatra", "Isis", "Hatshepsut"], correct: 1 },
    { q: "War between North/South USA?", options: ["Revolutionary", "Civil War", "WWI", "War of 1812"], correct: 1 },
    { q: "First to circumnavigate globe?", options: ["Columbus", "Magellan", "Drake", "Cook"], correct: 1 },
    { q: "Signers of Magna Carta year?", options: ["1066", "1215", "1492", "1776"], correct: 1 },
    { q: "Plague that killed millions?", options: ["Spanish Flu", "Black Death", "Cholera", "Smallpox"], correct: 1 },
  ],
  Technology: [
    { q: "What does CPU stand for?", options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Central Processor Unit"], correct: 2 },
    { q: "World's most popular search engine?", options: ["Yahoo", "Bing", "Google", "DuckDuckGo"], correct: 2 },
    { q: "Company that created the iPhone?", options: ["Microsoft", "Apple", "Samsung", "Google"], correct: 1 },
    { q: "First computer programmer?", options: ["Bill Gates", "Ada Lovelace", "Alan Turing", "Steve Jobs"], correct: 1 },
    { q: "What does WWW stand for?", options: ["World Wide Web", "World Wired Web", "Web Wide World", "World Wide Waves"], correct: 0 },
    { q: "Primary language for Android apps?", options: ["Swift", "Python", "Kotlin", "C++"], correct: 2 },
    { q: "A Bit consists of how many values?", options: ["1", "2", "8", "10"], correct: 1 },
    { q: "Founder of Facebook?", options: ["Jeff Bezos", "Elon Musk", "Mark Zuckerberg", "Jack Dorsey"], correct: 2 },
    { q: "Standard code for text characters?", options: ["HTML", "ASCII", "HTTP", "Binary"], correct: 1 },
    { q: "First 1TB hard drive year?", options: ["2000", "2005", "2007", "2010"], correct: 2 },
    { q: "Language of the Web?", options: ["Python", "Java", "JavaScript", "C#"], correct: 2 },
    { q: "Most used mobile OS?", options: ["iOS", "Android", "Windows", "Linux"], correct: 1 },
    { q: "Brain of the computer?", options: ["RAM", "Hard Drive", "CPU", "Motherboard"], correct: 2 },
    { q: "Inventor of the World Wide Web?", options: ["Steve Wozniak", "Tim Berners-Lee", "Bill Joy", "Vint Cerf"], correct: 1 },
    { q: "Type of memory that is volatile?", options: ["SSD", "ROM", "RAM", "Flash"], correct: 2 },
    { q: "Social media for 'Tweets'?", options: ["Instagram", "LinkedIn", "X (Twitter)", "Reddit"], correct: 2 },
    { q: "What does PDF stand for?", options: ["Personal Data File", "Portable Document Format", "Printable Digital File", "Primary Document Folder"], correct: 1 },
    { q: "Linux mascot animal?", options: ["Cat", "Penguin", "Dog", "Bird"], correct: 1 },
    { q: "Common name for software bugs?", options: ["Glitch", "Error", "Virus", "Crash"], correct: 0 },
    { q: "Standard for wireless internet?", options: ["Bluetooth", "NFC", "Wi-Fi", "Ethernet"], correct: 2 },
  ],
  Geography: [
    { q: "Smallest country in the world?", options: ["Monaco", "Malta", "Vatican City", "San Marino"], correct: 2 },
    { q: "Largest ocean on Earth?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
    { q: "Capital of Japan?", options: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], correct: 2 },
    { q: "Longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
    { q: "Country with the most people?", options: ["USA", "India", "China", "Russia"], correct: 1 },
    { q: "Highest mountain above sea level?", options: ["K2", "Mt. Everest", "Kilimanjaro", "Denali"], correct: 1 },
    { q: "Which desert is the largest?", options: ["Sahara", "Gobi", "Antarctic", "Arabian"], correct: 2 },
    { q: "Capital of France?", options: ["Lyon", "Marseille", "Paris", "Nice"], correct: 2 },
    { q: "How many continents are there?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "The 'Land of the Rising Sun'?", options: ["China", "Japan", "Thailand", "Korea"], correct: 1 },
    { q: "Country with most islands?", options: ["Indonesia", "Sweden", "Philippines", "Canada"], correct: 1 },
    { q: "Tallest waterfall in the world?", options: ["Niagara Falls", "Victoria Falls", "Angel Falls", "Iguazu Falls"], correct: 2 },
    { q: "Deepest point in the ocean?", options: ["Java Trench", "Mariana Trench", "Tonga Trench", "Puerto Rico Trench"], correct: 1 },
    { q: "Only country that is also a continent?", options: ["Brazil", "Australia", "India", "Canada"], correct: 1 },
    { q: "Capital of Italy?", options: ["Milan", "Venice", "Rome", "Naples"], correct: 2 },
    { q: "World's largest island?", options: ["Australia", "Greenland", "Borneo", "New Guinea"], correct: 1 },
    { q: "South America's largest country?", options: ["Argentina", "Colombia", "Brazil", "Peru"], correct: 2 },
    { q: "Ocean between USA and Europe?", options: ["Pacific", "Indian", "Atlantic", "Arctic"], correct: 2 },
    { q: "Largest lake in the world?", options: ["Lake Superior", "Caspian Sea", "Lake Victoria", "Lake Baikal"], correct: 1 },
    { q: "Which country has the most time zones?", options: ["Russia", "USA", "France", "China"], correct: 2 },
  ],
  Food: [
    { q: "Main ingredient in sushi?", options: ["Fish", "Rice", "Seaweed", "Cucumber"], correct: 1 },
    { q: "Known as King of Fruits?", options: ["Mango", "Durian", "Pineapple", "Apple"], correct: 1 },
    { q: "Most expensive spice by weight?", options: ["Vanilla", "Saffron", "Cinnamon", "Pepper"], correct: 1 },
    { q: "The base of guacamole?", options: ["Tomato", "Onion", "Avocado", "Lime"], correct: 2 },
    { q: "What is tofu made from?", options: ["Milk", "Soybeans", "Rice", "Wheat"], correct: 1 },
    { q: "Which country invented pizza?", options: ["USA", "Greece", "Italy", "France"], correct: 2 },
    { q: "Sweetener made by bees?", options: ["Sugar", "Honey", "Maple Syrup", "Stevia"], correct: 1 },
    { q: "Eggs in a dozen?", options: ["6", "10", "12", "15"], correct: 2 },
    { q: "The P in PB&J stands for?", options: ["Plum", "Peach", "Peanut Butter", "Pear"], correct: 2 },
    { q: "White sparkling wine from France?", options: ["Merlot", "Champagne", "Chardonnay", "Prosecco"], correct: 1 },
    { q: "Main ingredient in hummus?", options: ["Lentils", "Chickpeas", "Peas", "Beans"], correct: 1 },
    { q: "Which vitamin is in oranges?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 2 },
    { q: "National dish of Japan?", options: ["Ramen", "Sushi", "Curry Rice", "Tempura"], correct: 1 },
    { q: "Grains used to make beer?", options: ["Corn", "Barley", "Wheat", "Oats"], correct: 1 },
    { q: "Green paste served with sushi?", options: ["Pesto", "Wasabi", "Matcha", "Guacamole"], correct: 1 },
    { q: "Meat from a pig?", options: ["Beef", "Pork", "Venison", "Mutton"], correct: 1 },
    { q: "What is a dried grape called?", options: ["Prune", "Date", "Raisin", "Fig"], correct: 2 },
    { q: "Nut used in Nutella?", options: ["Walnut", "Peanut", "Hazelnut", "Almond"], correct: 2 },
    { q: "Pasta shaped like bowties?", options: ["Penne", "Farfalle", "Fusilli", "Rigatoni"], correct: 1 },
    { q: "Main ingredient in meringue?", options: ["Flour", "Egg Whites", "Butter", "Milk"], correct: 1 },
  ],
  Movies: [
    { q: "Who directed Jurassic Park?", options: ["James Cameron", "George Lucas", "Steven Spielberg", "Christopher Nolan"], correct: 2 },
    { q: "Highest grossing movie ever?", options: ["Titanic", "Avengers: Endgame", "Avatar", "Star Wars"], correct: 2 },
    { q: "Actor who played Iron Man?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Tom Holland"], correct: 1 },
    { q: "Fictional land in Lion King?", options: ["Narnia", "Pride Lands", "Neverland", "Middle Earth"], correct: 1 },
    { q: "First Disney feature film?", options: ["Pinocchio", "Cinderella", "Snow White", "Bambi"], correct: 2 },
    { q: "Harry Potter's pet owl?", options: ["Scabbers", "Hedwig", "Dobby", "Fawkes"], correct: 1 },
    { q: "2020 Best Picture (Korean)?", options: ["Oldboy", "Parasite", "Minari", "The Host"], correct: 1 },
    { q: "King of Rock and Roll movie?", options: ["Prince", "Michael Jackson", "Elvis Presley", "David Bowie"], correct: 2 },
    { q: "Line: 'I'll be back'?", options: ["Terminator", "Rambo", "Die Hard", "Robocop"], correct: 0 },
    { q: "Director of Inception?", options: ["Spike Lee", "Quentin Tarantino", "Christopher Nolan", "Martin Scorsese"], correct: 2 },
    { q: "City Batman protects?", options: ["Metropolis", "Gotham City", "Central City", "Star City"], correct: 1 },
    { q: "Movie featuring The Joker?", options: ["Spider-Man", "The Dark Knight", "Superman", "Iron Man"], correct: 1 },
    { q: "The color of Shrek?", options: ["Blue", "Yellow", "Green", "Red"], correct: 2 },
    { q: "James Bond code number?", options: ["001", "005", "007", "009"], correct: 2 },
    { q: "Jack in Titanic actor?", options: ["Brad Pitt", "Tom Cruise", "Leonardo DiCaprio", "Johnny Depp"], correct: 2 },
    { q: "First Star Wars movie year?", options: ["1975", "1977", "1980", "1983"], correct: 1 },
    { q: "Toy sheriff in Toy Story?", options: ["Buzz", "Rex", "Woody", "Hamm"], correct: 2 },
    { q: "Who is the Godfather?", options: ["Al Pacino", "Marlon Brando", "Robert De Niro", "Joe Pesci"], correct: 1 },
    { q: "Spider-Man's real name?", options: ["Bruce Wayne", "Clark Kent", "Peter Parker", "Tony Stark"], correct: 2 },
    { q: "Wolverine's metal claws?", options: ["Steel", "Titanium", "Adamantium", "Vibranium"], correct: 2 },
  ],
  Music: [
    { q: "Instruments with 88 keys?", options: ["Guitar", "Piano", "Harp", "Violin"], correct: 1 },
    { q: "King of Pop?", options: ["Elvis", "Michael Jackson", "Prince", "Bruno Mars"], correct: 1 },
    { q: "Highest female voice type?", options: ["Alto", "Soprano", "Mezzo", "Tenor"], correct: 1 },
    { q: "Number of strings on a standard guitar?", options: ["4", "5", "6", "12"], correct: 2 },
    { q: "Wrote the '9th Symphony' while deaf?", options: ["Mozart", "Bach", "Beethoven", "Chopin"], correct: 2 },
    { q: "Band known as 'Fab Four'?", options: ["Queen", "The Beatles", "Rolling Stones", "Led Zeppelin"], correct: 1 },
    { q: "Genre of Miles Davis?", options: ["Rock", "Jazz", "Classical", "Country"], correct: 1 },
    { q: "The lead singer of Queen?", options: ["Mick Jagger", "Freddie Mercury", "David Bowie", "Axl Rose"], correct: 1 },
    { q: "Woodwind instrument made of brass?", options: ["Flute", "Clarinet", "Saxophone", "Oboe"], correct: 2 },
    { q: "Who sang 'Rolling in the Deep'?", options: ["Adele", "Beyonce", "Rihanna", "Taylor Swift"], correct: 0 },
    { q: "Instrument associated with Sherlock Holmes?", options: ["Cello", "Violin", "Flute", "Piano"], correct: 1 },
    { q: "What is an orchestra leader called?", options: ["Director", "Maestro", "Conductor", "Chief"], correct: 2 },
    { q: "Bob Marley's music genre?", options: ["Salsa", "Reggae", "Blues", "Soul"], correct: 1 },
    { q: "Rihanna's home country?", options: ["Jamaica", "Barbados", "USA", "Trinidad"], correct: 1 },
    { q: "Lowest male voice type?", options: ["Tenor", "Baritone", "Bass", "Alto"], correct: 2 },
    { q: "Who is the 'Material Girl'?", options: ["Cher", "Madonna", "Lady Gaga", "Whitney Houston"], correct: 1 },
    { q: "Wrote 'The Four Seasons'?", options: ["Vivaldi", "Handel", "Bach", "Wagner"], correct: 0 },
    { q: "First name of Mozart?", options: ["Ludwig", "Wolfgang", "Sebastian", "Johann"], correct: 1 },
    { q: "Instrument you hit with sticks?", options: ["Trumpet", "Drums", "Harp", "Flute"], correct: 1 },
    { q: "Number of musicians in a quartet?", options: ["2", "3", "4", "5"], correct: 2 },
  ],
  Sports: [
    { q: "World Cup sport?", options: ["Basketball", "Soccer", "Tennis", "Cricket"], correct: 1 },
    { q: "Points for a 'Touchdown'?", options: ["3", "6", "7", "2"], correct: 1 },
    { q: "Highest score in a single bowling frame?", options: ["10", "20", "30", "15"], correct: 2 },
    { q: "The 'Greatest' boxer of all time?", options: ["Tyson", "Ali", "Mayweather", "Foreman"], correct: 1 },
    { q: "How many players on a baseball field?", options: ["8", "9", "11", "10"], correct: 1 },
    { q: "Golf: hole-in-one name?", options: ["Birdie", "Eagle", "Ace", "Albatross"], correct: 2 },
    { q: "Standard Olympic pool length?", options: ["25m", "50m", "100m", "75m"], correct: 1 },
    { q: "Colors of Olympic rings?", options: ["4", "5", "6", "3"], correct: 1 },
    { q: "NBA team from Chicago?", options: ["Lakers", "Bulls", "Heat", "Celtics"], correct: 1 },
    { q: "Tennis: 'Zero' points name?", options: ["Nada", "Nil", "Love", "Zero"], correct: 2 },
    { q: "Most gold medals in Olympics history?", options: ["Usain Bolt", "Michael Phelps", "Simone Biles", "Carl Lewis"], correct: 1 },
    { q: "Sport played at Wimbledon?", options: ["Golf", "Tennis", "Cricket", "Polo"], correct: 1 },
    { q: "Minutes in a standard soccer match?", options: ["60", "80", "90", "100"], correct: 2 },
    { q: "A 'puck' is used in?", options: ["Polo", "Hockey", "Golf", "Lacrosse"], correct: 1 },
    { q: "National sport of Japan?", options: ["Karate", "Sumo", "Judo", "Baseball"], correct: 1 },
    { q: "Lebron James sport?", options: ["Football", "Basketball", "Golf", "Tennis"], correct: 1 },
    { q: "Distance of a marathon?", options: ["21km", "42km", "10km", "50km"], correct: 1 },
    { q: "Sport with 'Grand Slams'?", options: ["Basketball", "Tennis", "Swimming", "Soccer"], correct: 1 },
    { q: "Tour de France sport?", options: ["Running", "Cycling", "Sailing", "Driving"], correct: 1 },
    { q: "Basketball hoop height (feet)?", options: ["8", "9", "10", "12"], correct: 2 },
  ],
  General: [
    { q: "Color of an Emerald?", options: ["Red", "Blue", "Green", "Yellow"], correct: 2 },
    { q: "Days in a leap year?", options: ["364", "365", "366", "367"], correct: 2 },
    { q: "Largest state in USA?", options: ["Texas", "California", "Alaska", "Florida"], correct: 2 },
    { q: "Hardest material in human body?", options: ["Bone", "Skull", "Enamel", "Cartilage"], correct: 2 },
    { q: "The statue in NY Harbor?", options: ["Lincoln", "Liberty", "Justice", "Freedom"], correct: 1 },
    { q: "Roman numeral for 5?", options: ["I", "V", "X", "L"], correct: 1 },
    { q: "How many colors in a rainbow?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "Capital of the UK?", options: ["London", "Dublin", "Paris", "Berlin"], correct: 0 },
    { q: "Primary colors?", options: ["Red/Blue/Green", "Red/Yellow/Blue", "Orange/Green/Purple", "Black/White"], correct: 1 },
    { q: "Inventor of telephone?", options: ["Edison", "Tesla", "Bell", "Ford"], correct: 2 },
    { q: "Longest month name?", options: ["September", "December", "January", "February"], correct: 0 },
    { q: "Language spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], correct: 1 },
    { q: "Does a straw have 1 hole or 2?", options: ["1", "2", "0", "Infinite"], correct: 0 },
    { q: "Freezing point of water (°F)?", options: ["0", "32", "100", "212"], correct: 1 },
    { q: "Which hand is the Statue of Liberty's torch in?", options: ["Left", "Right", "Both", "Neither"], correct: 1 },
    { q: "Company with the 'Swoosh' logo?", options: ["Adidas", "Nike", "Puma", "Reebok"], correct: 1 },
    { q: "Zodiac sign with the Twins?", options: ["Aries", "Leo", "Gemini", "Libra"], correct: 2 },
    { q: "Most common blood type?", options: ["A+", "B-", "O+", "AB+"], correct: 2 },
    { q: "How many teeth in adult mouth?", options: ["28", "30", "32", "34"], correct: 2 },
    { q: "Currency of Japan?", options: ["Yuan", "Won", "Yen", "Baht"], correct: 2 },
  ],
  Literature: [
    { q: "First book of the Bible?", options: ["Exodus", "Psalms", "Genesis", "Matthew"], correct: 2 },
    { q: "Detective at 221B Baker Street?", options: ["Poirot", "Sherlock Holmes", "Bond", "Marple"], correct: 1 },
    { q: "Wrote 'The Odyssey'?", options: ["Plato", "Homer", "Virgil", "Socrates"], correct: 1 },
    { q: "Harry Potter's scar shape?", options: ["Lightning", "Star", "Circle", "Cross"], correct: 0 },
    { q: "A story about your own life?", options: ["Biography", "Autobiography", "Novel", "Essay"], correct: 1 },
    { q: "Wrote 'Huckleberry Finn'?", options: ["Mark Twain", "Hemingway", "Poe", "Steinbeck"], correct: 0 },
    { q: "The hobbit who found the Ring?", options: ["Frodo", "Bilbo", "Sam", "Gollum"], correct: 1 },
    { q: "Protagonist of '1984'?", options: ["Big Brother", "Winston Smith", "Julia", "O'Brien"], correct: 1 },
    { q: "Country of Shakespeare?", options: ["USA", "England", "Ireland", "Scotland"], correct: 1 },
    { q: "Wrote 'The Great Gatsby'?", options: ["Fitzgerald", "Faulkner", "Miller", "Orwell"], correct: 0 },
    { q: "Vampire in 'Dracula'?", options: ["Edward", "Count Dracula", "Lestat", "Blade"], correct: 1 },
    { q: "The 'King of Horror' author?", options: ["Dean Koontz", "Stephen King", "Clive Barker", "HP Lovecraft"], correct: 1 },
    { q: "Wrote 'Alice in Wonderland'?", options: ["Lewis Carroll", "CS Lewis", "Roald Dahl", "Dr Seuss"], correct: 0 },
    { q: "Language of Dante's Inferno?", options: ["Latin", "Italian", "Spanish", "Greek"], correct: 1 },
    { q: "Genre of 'Frankenstein'?", options: ["Romance", "Horror/Sci-Fi", "Western", "Mystery"], correct: 1 },
    { q: "Captain of the Pequod?", options: ["Nemo", "Ahab", "Hook", "Jack"], correct: 1 },
    { q: "Number of ghosts in A Christmas Carol?", options: ["3", "4", "5", "2"], correct: 1 },
    { q: "The wizard in 'Lord of the Rings'?", options: ["Dumbledore", "Gandalf", "Merlin", "Saruman"], correct: 1 },
    { q: "Wrote 'Pride and Prejudice'?", options: ["Jane Austen", "Charlotte Bronte", "Emily Dickinson", "Mary Shelley"], correct: 0 },
    { q: "Fictional land in Narnia?", options: ["Westeros", "Oz", "Narnia", "Neverland"], correct: 2 },
  ],
  Art: [
    { q: "Who painted the Mona Lisa?", options: ["Da Vinci", "Van Gogh", "Picasso", "Monet"], correct: 0 },
    { q: "Primary colors of paint?", options: ["RGB", "RYB", "CMYK", "B&W"], correct: 1 },
    { q: "Sculptor of 'David'?", options: ["Donatello", "Michelangelo", "Bernini", "Rodin"], correct: 1 },
    { q: "Art style of Salvador Dali?", options: ["Cubism", "Impressionism", "Surrealism", "Pop Art"], correct: 2 },
    { q: "Who painted Starry Night?", options: ["Gauguin", "Van Gogh", "Renoir", "Cezanne"], correct: 1 },
  ],
  Mythology: [
    { q: "King of Greek Gods?", options: ["Hades", "Poseidon", "Zeus", "Apollo"], correct: 2 },
    { q: "Norse God of Thunder?", options: ["Odin", "Loki", "Thor", "Freya"], correct: 2 },
    { q: "Three-headed dog of Hades?", options: ["Hydra", "Cerberus", "Chimera", "Minotaur"], correct: 1 },
    { q: "Roman name for Zeus?", options: ["Mars", "Jupiter", "Neptune", "Saturn"], correct: 1 },
    { q: "Egyptian Sun God?", options: ["Anubis", "Osiris", "Ra", "Horus"], correct: 2 },
  ],
  Space: [
    { q: "First human on the moon?", options: ["Gagarin", "Armstrong", "Aldrin", "Glenn"], correct: 1 },
    { q: "Largest planet in Solar System?", options: ["Saturn", "Jupiter", "Neptune", "Earth"], correct: 1 },
    { q: "What is a Supernova?", options: ["New Star", "Dead Planet", "Exploding Star", "Black Hole"], correct: 2 },
    { q: "Our galaxy name?", options: ["Andromeda", "Milky Way", "Orion", "Centauri"], correct: 1 },
    { q: "Closest star to Earth?", options: ["Sirius", "Sun", "Proxima Centauri", "Vega"], correct: 1 },
  ],
  Body: [
    { q: "Largest organ?", options: ["Liver", "Heart", "Skin", "Lungs"], correct: 2 },
    { q: "Bones in an adult?", options: ["200", "206", "212", "250"], correct: 1 },
    { q: "Powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], correct: 2 },
    { q: "Pump for blood?", options: ["Brain", "Lungs", "Heart", "Kidneys"], correct: 2 },
    { q: "Smallest bone location?", options: ["Nose", "Ear", "Finger", "Toe"], correct: 1 },
  ],
  CompSci: [
    { q: "What is 101 in binary?", options: ["3", "5", "7", "9"], correct: 1 },
    { q: "Founder of Microsoft?", options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Jeff Bezos"], correct: 1 },
    { q: "Logic gate for inversion?", options: ["AND", "OR", "NOT", "XOR"], correct: 2 },
    { q: "Brain of the computer?", options: ["RAM", "GPU", "CPU", "Motherboard"], correct: 2 },
    { q: "A 'byte' has how many bits?", options: ["4", "8", "16", "32"], correct: 1 },
  ],
  Landmarks: [
    { q: "Eiffel Tower location?", options: ["London", "Rome", "Paris", "Berlin"], correct: 2 },
    { q: "Statue of Liberty location?", options: ["New Jersey", "New York", "Boston", "D.C."], correct: 1 },
    { q: "Where are the Pyramids?", options: ["Mexico", "Peru", "Egypt", "Sudan"], correct: 2 },
    { q: "Great Wall location?", options: ["Japan", "China", "Korea", "Vietnam"], correct: 1 },
    { q: "Taj Mahal location?", options: ["Pakistan", "India", "Iran", "Turkey"], correct: 1 },
  ],
  Gaming: [
    { q: "Sega's mascot?", options: ["Mario", "Sonic", "Link", "Pac-Man"], correct: 1 },
    { q: "Highest selling console?", options: ["PS2", "Wii", "Gameboy", "DS"], correct: 0 },
    { q: "What is Minecraft's world made of?", options: ["Circles", "Lines", "Blocks", "Triangles"], correct: 2 },
    { q: "Nintendo's mascot?", options: ["Luigi", "Donkey Kong", "Mario", "Pikachu"], correct: 2 },
    { q: "Game featuring Master Chief?", options: ["Call of Duty", "Halo", "Doom", "Quake"], correct: 1 },
  ],
  Ocean: [
    { q: "Largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
    { q: "Deepest point?", options: ["Java Trench", "Mariana Trench", "Tonga Trench", "Puerto Rico"], correct: 1 },
    { q: "Do sharks have bones?", options: ["Yes", "No", "Some", "Only Jaws"], correct: 1 },
    { q: "What percent of Earth is water?", options: ["50%", "60%", "71%", "85%"], correct: 2 },
    { q: "Largest animal in the ocean?", options: ["Whale Shark", "Giant Squid", "Blue Whale", "Orca"], correct: 2 },
  ]
};

export default function Study() {
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [userCardCount, setUserCardCount] = useState(0);
  const [highScores, setHighScores] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Animals", icon: "paw", color: "#4CAF50" },
    { name: "Planets", icon: "planet", color: "#2196F3" },
    { name: "Science", icon: "beaker", color: "#FF9800" },
    { name: "History", icon: "book", color: "#E91E63" },
    { name: "Technology", icon: "hardware-chip", color: "#607D8B" },
    { name: "Geography", icon: "map", color: "#795548" },
    { name: "Food", icon: "fast-food", color: "#FF5722" },
    { name: "Movies", icon: "film", color: "#673AB7" },
    { name: "Music", icon: "musical-notes", color: "#00BCD4" },
    { name: "Sports", icon: "basketball", color: "#FF5252" },
    { name: "General", icon: "bulb", color: "#FFC107" },
    { name: "Literature", icon: "library", color: "#8BC34A" },
    { name: "Art", icon: "brush", color: "#9C27B0" },
    { name: "Mythology", icon: "thunderstorm", color: "#FFEB3B" },
    { name: "Space", icon: "rocket", color: "#3F51B5" },
    { name: "Body", icon: "body", color: "#F44336" },
    { name: "CompSci", icon: "code-slash", color: "#212121" },
    { name: "Landmarks", icon: "business", color: "#8D6E63" },
    { name: "Gaming", icon: "game-controller", color: "#00E676" },
    { name: "Ocean", icon: "water", color: "#03A9F4" },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const data = await AsyncStorage.getItem("flashcards");
          if (data) setUserCardCount(JSON.parse(data).length);

          const scores: Record<string, string> = {};
          const allNames = [...categories.map((c) => c.name), "Your Deck"];
          for (const name of allNames) {
            const s = await AsyncStorage.getItem(`highScore_${name}`);
            if (s) scores[name] = s;
          }
          setHighScores(scores);
        } catch (e) {
          console.log("Error loading study data:", e);
        }
      };
      loadData();
    }, [])
  );

  const startQuiz = (category: string) => {
    router.push({
      pathname: "/quiz",
      params: { category, isTimed: isTimedMode.toString() },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backHeader}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.headerTitle}>Start Study</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsTimedMode(!isTimedMode)}
        style={[styles.timeBanner, { backgroundColor: isTimedMode ? "#5A67F2" : "#7E8AF4" }]}
      >
        <MaterialCommunityIcons name="timer-outline" size={32} color="#fff" />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.timeTitle}>Time Quiz Mode</Text>
          <Text style={styles.timeSub}>{isTimedMode ? "60s per round" : "Tap to enable"}</Text>
        </View>
        <Ionicons name={isTimedMode ? "checkbox" : "square-outline"} size={26} color="#fff" />
      </TouchableOpacity>

      <View style={styles.searchRow}>
        <Text style={styles.label}>CATEGORIES ({filteredCategories.length})</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {filteredCategories.map((item) => (
          <TouchableOpacity key={item.name} style={styles.card} onPress={() => startQuiz(item.name)}>
            <View style={[styles.iconCircle, { backgroundColor: item.color + "20" }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cardCount}>{QUESTION_DATA[item.name]?.length || 0} cards</Text>
            {highScores[item.name] && (
              <View style={styles.scoreContainer}>
                <Ionicons name="trophy" size={10} color="#4CAF50" />
                <Text style={styles.bestScoreText}> {highScores[item.name]}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {("your deck".includes(searchQuery.toLowerCase()) || searchQuery === "") && (
          <TouchableOpacity style={[styles.card, styles.userCard]} onPress={() => startQuiz("Your Deck")}>
            <View style={styles.iconCircle}>
              <Ionicons name="bookmark" size={24} color="#5A67F2" />
            </View>
            <Text style={styles.cardName}>Your Deck</Text>
            <Text style={styles.cardCount}>{userCardCount} cards</Text>
            {highScores["Your Deck"] && (
              <View style={styles.scoreContainer}>
                <Ionicons name="trophy" size={10} color="#4CAF50" />
                <Text style={styles.bestScoreText}> {highScores["Your Deck"]}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        <View style={{ height: 120, width: "100%" }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 20 },
  backHeader: { marginTop: 40, flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", marginLeft: 10 },
  timeBanner: { padding: 22, borderRadius: 25, flexDirection: "row", alignItems: "center", marginBottom: 25 },
  timeTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  timeSub: { color: "#fff", opacity: 0.8, fontSize: 13 },
  searchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  label: { fontSize: 13, fontWeight: "800", color: "#bbb" },
  searchContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    paddingHorizontal: 12, 
    borderRadius: 12, 
    width: "45%", 
    height: 35,
    borderWidth: 1,
    borderColor: "#eee"
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#333" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { backgroundColor: "#fff", width: "31%", padding: 12, borderRadius: 20, marginBottom: 12, alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
  userCard: { borderWidth: 1.5, borderColor: "#5A67F2", borderStyle: "dashed" },
  iconCircle: { padding: 12, borderRadius: 15, marginBottom: 8, backgroundColor: "#F0F2FF" },
  cardName: { fontWeight: "bold", fontSize: 13, color: "#333" },
  cardCount: { fontSize: 10, color: "#999" },
  scoreContainer: { flexDirection: "row", alignItems: "center", marginTop: 5, backgroundColor: "#E8F5E9", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  bestScoreText: { fontSize: 9, color: "#4CAF50", fontWeight: "bold" },
});