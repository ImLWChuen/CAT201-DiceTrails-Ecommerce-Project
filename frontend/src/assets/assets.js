import p1_img_01 from './p1_img_01.png'
import p1_img_02 from './p1_img_02.png'
import p1_img_03 from './p1_img_03.png'
import p2_img_01 from './p2_img_01.png'
import p2_img_02 from './p2_img_02.png'
import p2_img_03 from './p2_img_03.png'
import p3_img_01 from './p3_img_01.png'
import p3_img_02 from './p3_img_02.png'
import p3_img_03 from './p3_img_03.png'
import p4_img_01 from './p4_img_01.png'
import p4_img_02 from './p4_img_02.png'
import p4_img_03 from './p4_img_03.png'
import p5_img_01 from './p5_img_01.png'
import p5_img_02 from './p5_img_02.png'
import p5_img_03 from './p5_img_03.png'
import p6_img_01 from './p6_img_01.png'
import p6_img_02 from './p6_img_02.png'
import p6_img_03 from './p6_img_03.png'
import p7_img_01 from './p7_img_01.png'
import p7_img_02 from './p7_img_02.png'
import p7_img_03 from './p7_img_03.png'
import p8_img_01 from './p8_img_01.png'
import p8_img_02 from './p8_img_02.png'
import p8_img_03 from './p8_img_03.png'
import p9_img_01 from './p9_img_01.png'
import p9_img_02 from './p9_img_02.png'
import p9_img_03 from './p9_img_03.png'
import p10_img_01 from './p10_img_01.png'
import p10_img_02 from './p10_img_02.png'
import p10_img_03 from './p10_img_03.png'
import p11_img_01 from './p11_img_01.png'
import p11_img_02 from './p11_img_02.png'
import p11_img_03 from './p11_img_03.png'
import p12_img_01 from './p12_img_01.png'
import p12_img_02 from './p12_img_02.png'
import p12_img_03 from './p12_img_03.png'
import p13_img_01 from './p13_img_01.png'
import p13_img_02 from './p13_img_02.png'
import p13_img_03 from './p13_img_03.png'

import logo from './DiceTrails_Logo.png'
import hero_img from './hero_img.jpg'
import cart_icon from './shopping_cart_icon.png'
import bin_icon from './delete_icon.png'
import profile_icon from './profile_icon.png'
import dropdown_icon from './arrow_down_icon.png'
import exchange_icon from './exchange_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import close_icon from './close_icon.png'
import menu_icon from './menu_icon.png'
import star_icon from './star_empty.png'
import star_dull_icon from './star_half.png'
import star_full from './star_full.png'
import support_icon from './support_icon.png'
import about_icon from './about_icon.png'
import mastercard_logo from './Mastercard-logo.png'
import visa_logo from './visa-logo.png'
import tng_logo from './touch-n-go-logo.png'
import privacy_icon from './privacy_icon.png'
import thumbs_up_icon from './thumb_up.png'
import thumbs_up_full_icon from './thumb_up_full.png'

export const assets = {
    logo,
    hero_img,
    cart_icon,
    bin_icon,
    profile_icon,
    dropdown_icon,
    exchange_icon,
    quality_icon,
    search_icon,
    close_icon,
    menu_icon,
    star_icon,
    star_dull_icon,
    support_icon,
    about_icon,
    mastercard_logo,
    visa_logo,
    tng_logo,
    privacy_icon,
    star_full,
    star_half: star_dull_icon, // Alias for backward compatibility if needed, or use explicit export
    star_empty: star_icon, // Alias
    thumbs_up_icon,
    thumbs_up_full_icon
}

export const products = [
    {
        _id: "aaaaa",
        name: "Catan: The Game",
        description: "A fun and engaging board game for all ages.",
        price: 29.99,
        image: [p1_img_01, p1_img_02, p1_img_03],
        category: "board games",
        subCategory: "strategy",
        date: "17166343453448",
        bestseller: true,
    },
    {
        _id: "aaaab",
        name: "Monopoly",
        description: "The classic fast-dealing property trading game where players buy, sell, and dream their way to riches.",
        price: 29.99,
        image: [p2_img_01, p2_img_02, p2_img_03],
        category: "board games",
        subCategory: "family",
        date: "17166343454001",
        bestseller: true,
    },
    {
        _id: "aaaac",
        name: "7 Wonders Architects",
        description: "A fast-paced strategy game where players race to build an architectural wonder of the ancient world.",
        price: 49.99,
        image: [p3_img_01, p3_img_02, p3_img_03],
        category: "board games",
        subCategory: "strategy",
        date: "17166343454002",
        bestseller: false,
    },
    {
        _id: "aaaad",
        name: "Coup",
        description: "A game of bluffing and deception where you manipulate, bribe, and bluff your way to power.",
        price: 14.99,
        image: [p4_img_01, p4_img_02, p4_img_03],
        category: "card games",
        subCategory: "party",
        date: "17166343454003",
        bestseller: true,
    },
    {
        _id: "aaaae",
        name: "Sushi Go!",
        description: "A pick-and-pass card game where you grab the best combination of sushi dishes as they whiz by.",
        price: 12.99,
        image: [p5_img_01, p5_img_02, p5_img_03],
        category: "card games",
        subCategory: "family",
        date: "17166343454004",
        bestseller: true,
    },
    {
        _id: "aaaaf",
        name: "Chess",
        description: "The timeless game of strategy and tactics played on a checkered board.",
        price: 19.99,
        image: [p6_img_01, p6_img_02, p6_img_03],
        category: "board games",
        subCategory: "abstract",
        date: "17166343454005",
        bestseller: false,
    },
    {
        _id: "aaaag",
        name: "Chinese Chess (Xiangqi)",
        description: "A traditional strategy board game for two players, simulating a battle between two armies.",
        price: 15.99,
        image: [p7_img_01, p7_img_02, p7_img_03],
        category: "board games",
        subCategory: "abstract",
        date: "17166343454006",
        bestseller: false,
    },
    {
        _id: "aaaah",
        name: "Nasi Lemak The Game",
        description: "A Malaysian card game where players race to assemble the perfect plate of Nasi Lemak.",
        price: 18.00,
        image: [p8_img_01, p8_img_02, p8_img_03],
        category: "card games",
        subCategory: "family",
        date: "17166343454007",
        bestseller: true,
    },
    {
        _id: "aaaai",
        name: "The Game of Life",
        description: "A family classic where players navigate life's milestones, from college to retirement.",
        price: 24.99,
        image: [p9_img_01, p9_img_02, p9_img_03],
        category: "board games",
        subCategory: "family",
        date: "17166343454008",
        bestseller: false,
    },
    {
        _id: "aaaaj",
        name: "Uno",
        description: "The classic card game of matching colors and numbers that is easy to pick up and impossible to put down.",
        price: 9.99,
        image: [p10_img_01, p10_img_02, p10_img_03],
        category: "card games",
        subCategory: "party",
        date: "17166343454009",
        bestseller: true,
    },
    {
        _id: "aaaak",
        name: "Scrabble",
        description: "The classic crossword game where every letter counts. Build words, score points, and challenge your friends and family in this ultimate test of vocabulary.",
        price: 19.99,
        image: [p11_img_01, p11_img_02, p11_img_03],
        category: "board games",
        subCategory: "word",
        date: "17166343454110",
        bestseller: true,
    },
    {
        _id: "aaaal",
        name: "Cluedo: Scooby-Doo Edition",
        description: "Jeepers! Help the Mystery Inc. gang solve the mystery in this spooky twist on the classic detective game. Figure out who was abducted, where, and what item was left behind.",
        price: 24.99,
        image: [p12_img_01, p12_img_02, p12_img_03],
        category: "board games",
        subCategory: "mystery",
        date: "17166343454111",
        bestseller: false,
    },
    {
        _id: "aaaam",
        name: "Codenames",
        description: "A social word game where two rival spymasters know the secret identities of 25 agents. Teammates try to guess words of their color while avoiding the assassin.",
        price: 15.99,
        image: [p13_img_01, p13_img_02, p13_img_03],
        category: "card games",
        subCategory: "party",
        date: "17166343454112",
        bestseller: true,
    }
]