import p1_img_01 from './p1_img_01.png'
import p1_img_02 from './p1_img_02.jpg'
import p1_img_03 from './p1_img_03.jpg'
import p2_img_01 from './p2_img_01.jpg'
import p2_img_02 from './p2_img_02.jpg'
import p2_img_03 from './p2_img_03.jpg'
import p3_img_01 from './p3_img_01.png'
import p3_img_02 from './p3_img_02.jpg'
import p3_img_03 from './p3_img_03.jpg'
import p4_img_01 from './p4_img_01.jpg'
import p4_img_02 from './p4_img_02.jpg'
import p4_img_03 from './p4_img_03.jpg'
import p5_img_01 from './p5_img_01.jpg'
import p5_img_02 from './p5_img_02.jpg'
import p5_img_03 from './p5_img_03.jpg'
import p6_img_01 from './p6_img_01.jpg'
import p6_img_02 from './p6_img_02.jpg'
import p6_img_03 from './p6_img_03.jpg'
import p7_img_01 from './p7_img_01.jpg'
import p7_img_02 from './p7_img_02.jpg'
import p7_img_03 from './p7_img_03.jpg'
import p8_img_01 from './p8_img_01.jpg'
import p8_img_02 from './p8_img_02.jpg'
import p8_img_03 from './p8_img_03.jpg'
import p9_img_01 from './p9_img_01.jpg'
import p9_img_02 from './p9_img_02.jpg'
import p9_img_03 from './p9_img_03.jpg'
import p10_img_01 from './p10_img_01.jpg'
import p10_img_02 from './p10_img_02.jpg'
import p10_img_03 from './p10_img_03.jpg'

import logo from './dicetrail_logo.png'
import hero_img from './hero_img.jpg'
import cart_icon from './shopping_cart_icon.png'
import bin_icon from './delete_icon.png'
import profile_icon from './profile_icon.png'
import dropdown_icon from './arrow_down_icon.png'
import exchange_icon from './change_icon.png'
import quality_icon from './award_star.png'
import search_icon from './search_icon.png'
import close_icon from './close_icon.png'
import menu_icon from './menu_icon.png'
import star_icon from './star_empty.png'
import star_dull_icon from './star_half.png'
import support_icon from './contact_support.png'
import about_icon from './about_icon.png'
import mastercard_logo from './Mastercard-logo.png'
import visa_logo from './visa-logo.png'
import tng_logo from './touch-n-go-logo.png'

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
    }
]