import homeOne from '../assets/home1.jpeg';
import homeTwo from '../assets/home2.jpeg';
import homeThree from '../assets/home3.jpeg';

export const HOME__DATA = [
    {
        id: "01",
        name: "Luxury NYC Penthouse",
        address: "157 W 57th St APT 49B, New York, NY 10019",
        description: "Luxury Penthouse located in the heart of NYC",
        image: homeOne,
        attributes: [
            {
                "trait_type": "Purchase Price",
                "value": 20
            },
            {
                "trait_type": "Type of Residence",
                "value": "Condo"
            },
            {
                "trait_type": "Bed Rooms",
                "value": 2
            },
            {
                "trait_type": "Bathrooms",
                "value": 3
            },
            {
                "trait_type": "Square Feet",
                "value": 2200
            },
            {
                "trait_type": "Year Built",
                "value": 2013
            }
        ]
    },

    {
        id: "02",
        name: "Architectural CA Modern Home",
        address: "70780 Tamarisk Ln, Rancho Mirage, CA 92270",
        description: "Beautiful modern home in Rancho Mirage",
        image: homeTwo,
        attributes: [
            {
                "trait_type": "Purchase Price",
                "value": 15
            },
            {
                "trait_type": "Type of Residence",
                "value": "Single family residence"
            },
            {
                "trait_type": "Bed Rooms",
                "value": 4
            },
            {
                "trait_type": "Bathrooms",
                "value": 4
            },
            {
                "trait_type": "Square Feet",
                "value": 3979
            },
            {
                "trait_type": "Year Built",
                "value": 1980
            }
        ]
    },

    {
        id: "03",
        name: "WA Nature Home",
        address: "183 Woodland Drive, Camano Island, WA 98282",
        description: "Comfy island home on Camano Island",
        image: homeThree,
        attributes: [
            {
                "trait_type": "Purchase Price",
                "value": 10
            },
            {
                "trait_type": "Type of Residence",
                "value": "Single family residence"
            },
            {
                "trait_type": "Bed Rooms",
                "value": 3
            },
            {
                "trait_type": "Bathrooms",
                "value": 3
            },
            {
                "trait_type": "Square Feet",
                "value": 2202
            },
            {
                "trait_type": "Year Built",
                "value": 2020
            }
        ]
    }
]

export default HOME__DATA