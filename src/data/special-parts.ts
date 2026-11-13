/**
 * src/data/special-parts.ts — 由 scripts/gen-special-parts.mjs 从参考站 DOM 抽取。
 * 参考：https://www.bossard.com/global-en/product-solutions/special-parts-and-custom-fasteners/
 * 手工改动会在下次生成时丢失。
 */

export interface SpecialPartsImage {
	src: string;
	alt: string;
}

export interface RichBlock {
	kind: 'p' | 'label' | 'ul';
	text?: string;
	items?: string[];
}

export interface AccordionItem {
	title: string;
	body: RichBlock[];
	image?: SpecialPartsImage | null;
	dialogImage?: SpecialPartsImage | null;
	caption?: string;
}

export interface Gallery {
	slides: SpecialPartsImage[];
	thumbs: SpecialPartsImage[];
	dialog: { image: SpecialPartsImage | null; caption: string };
}

export const SPECIAL_PARTS = {
	"seo": {
		"title": "Special Parts and Custom Fasteners",
		"description": "Do you need non-standard fasteners or parts that fulfil specific requirements? We match you with the appropriate manufacturer from our worldwide supplier portfolio to get you exactly what you need."
	},
	"hero": {
		"crumbs": [
			{
				"label": "Bossard homepage",
				"href": "/global-en/"
			},
			{
				"label": "Product Solutions",
				"href": "/global-en/product-solutions/"
			},
			{
				"label": "Special Parts"
			}
		],
		"eyebrow": "Product Solutions",
		"heading": "Special Parts and Custom Fasteners: Customized to Your Specifications",
		"lead": "Do you need non-standard fasteners or parts that fulfil specific requirements? We match you with the appropriate manufacturer from our worldwide supplier portfolio to get you exactly what you need.",
		"image": {
			"src": "/images/special-parts-and-custom-fasteners/01-an-overview-of-special-parts-and-custom-fastener.webp",
			"alt": "An overview of special parts and custom fasteners created by Bossard."
		}
	},
	"benefits": {
		"heading": "Why You Should Procure Your Special Parts and Custom Fasteners from Bossard",
		"cards": [
			{
				"icon": {
					"src": "/images/special-parts-and-custom-fasteners/02-suppliers-icon.webp",
					"alt": "Suppliers icon"
				},
				"title": "Fewer Suppliers",
				"text": "Reduce the number of suppliers you are working with and cut unnecessary overhead."
			},
			{
				"icon": {
					"src": "/images/special-parts-and-custom-fasteners/03-engineering-measurement-icon.svg",
					"alt": "Engineering & measurement icon"
				},
				"title": "Comprehensive Engineering Services",
				"text": "Benefit from our engineers’ expertise in all things fastening."
			},
			{
				"icon": {
					"src": "/images/special-parts-and-custom-fasteners/04-increasing-product-quality-icon.svg",
					"alt": "Increasing product quality icon"
				},
				"title": "Consistent Quality",
				"text": "We only work with selected suppliers that fulfil rigorous standards to ensure top product quality."
			},
			{
				"icon": {
					"src": "/images/special-parts-and-custom-fasteners/05-smart-factory-logistics-icon.svg",
					"alt": "Smart factory logistics icon"
				},
				"title": "Smart B- and C-Parts Management",
				"text": "Optimize your supply chain further with our smart factory logistics services."
			},
			{
				"icon": {
					"src": "/images/special-parts-and-custom-fasteners/06-maximizing-flexibility-in-production-icon.svg",
					"alt": "Maximizing flexibility in production icon"
				},
				"title": "Flexible Release Quantity",
				"text": "Whether you need bigger quantities or just a few parts for your prototype, we’ve got you covered."
			},
			{
				"icon": {
					"src": "/images/special-parts-and-custom-fasteners/07-dollar-icon.svg",
					"alt": "Dollar icon"
				},
				"title": "More Free Capital",
				"text": "Reduce your inventory, become leaner, and free up capital to invest where it matters."
			}
		]
	},
	"intro": {
		"paragraph": "We understand that unique challenges demand tailored solutions. Our special parts and custom fasteners simplify your supply chain, reduce costs, and deliver consistent quality. As your one-stop shop we provide you with custom fasteners and special parts such as",
		"list": [
			"CNC parts",
			"Machining (turned parts and milled parts)",
			"Cold-formed and hot-forged parts",
			"Punched and bent parts",
			"Thread cutting and milling",
			"Prototypes for series production",
			"Functional coatings and mechanical finishing treatments",
			"Kitting"
		],
		"closing": "Depending on batch sizes, required delivery times, material specifications, or manufacturing tolerances, different manufacturing processes may be optimal for you. Together, we select the most efficient option for your application."
	},
	"tech": {
		"heading": "Our Technological Capabilities",
		"items": [
			{
				"title": "Turned and Milled Parts (Machining)",
				"body": [
					{
						"kind": "p",
						"text": "When you require high precision, low tolerances, and complicated, forms metal-cutting production comes into play. This involves turning, milling, and drilling. We supply a wide range of machined parts in all common materials, batch sizes, dimensions, and surface treatments for the perfect interaction of your products."
					},
					{
						"kind": "label",
						"text": "Materials:"
					},
					{
						"kind": "ul",
						"items": [
							"All machinable steels",
							"Non-ferrous metals and plastic",
							"Stainless steels",
							"Many special-purpose steels"
						]
					},
					{
						"kind": "p",
						"text": ""
					}
				],
				"image": null,
				"dialogImage": null,
				"caption": ""
			},
			{
				"title": "Formed Parts (Hot-Forged and Cold-Formed Parts)",
				"body": [
					{
						"kind": "p",
						"text": "Formed parts are characterized by high material utilization, short production times, and increased strength. They are also particularly cost-effective. Material, drive style, manufacturing tolerances, and other comparable requirements dictate whether a specialty item can be produced by either cold forming or hot forging."
					},
					{
						"kind": "label",
						"text": "Hot-forged parts materials:"
					},
					{
						"kind": "ul",
						"items": [
							"All established steels, including stainless steels",
							"Special-purpose materials such as nimonic on request"
						]
					},
					{
						"kind": "label",
						"text": "Cold-formed parts materials:"
					},
					{
						"kind": "ul",
						"items": [
							"All established steels, including stainless steels",
							"Aluminum",
							"Brass",
							"Special-purpose steel and titanium on request"
						]
					},
					{
						"kind": "p",
						"text": ""
					}
				],
				"image": null,
				"dialogImage": null,
				"caption": ""
			},
			{
				"title": "Punched and Bent Parts",
				"body": [
					{
						"kind": "p",
						"text": "Fastening elements, washers, and many other parts for machinery and equipment construction are formed with punching and bending technologies. For punched and bent parts, we offer all currently available manufacturing processes as well as all possibilities of dimensions and surface coatings. Our partners are manufacturing specialists for any requirements."
					},
					{
						"kind": "label",
						"text": "Materials:"
					},
					{
						"kind": "ul",
						"items": [
							"All established steels, including stainless steels",
							"Spring steels",
							"Non-ferrous metals",
							"Special-purpose materials on request"
						]
					},
					{
						"kind": "p",
						"text": "On request, small production runs can also be cut with laser, plasma, or water jet, depending on the part’s geometry."
					},
					{
						"kind": "p",
						"text": ""
					}
				],
				"image": null,
				"dialogImage": null,
				"caption": ""
			}
		]
	},
	"rail1": {
		"slides": [
			{
				"src": "/images/special-parts-and-custom-fasteners/08-cnc-turned-cylinder-metal.webp",
				"alt": "CNC turned cylinder metal"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/09-a-metal-special-part-base-plate-created-by-cnc-m.webp",
				"alt": "A metal special part (base plate), created by cnc machining"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/10-a-black-turned-part-lying-on-white-background.webp",
				"alt": "A black turned part, lying on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/11-a-stainless-steel-swivel-arm-special-part.webp",
				"alt": "A Stainless Steel Swivel Arm special part"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/12-a-stainless-steel-turned-part-sleeve-guide.webp",
				"alt": "A stainless steel turned part sleeve guide"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/13-a-white-lateral-guidance-part.webp",
				"alt": "A white lateral guidance part"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/14-a-brass-grid-bolt-as-an-example-for-a-bossard-sp.webp",
				"alt": "A brass grid bolt as an example for a Bossard special part"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/15-a-black-bearing-bolt-on-white-background.webp",
				"alt": "A black bearing bolt on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/16-a-dark-blue-spacer-screw-on-white-background.webp",
				"alt": "A dark blue spacer screw on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/17-close-up-of-a-stainless-steel-shoulder-screw-on-.webp",
				"alt": "Close-up of a stainless steel shoulder screw on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/18-a-stainless-steel-formed-part-sleeve-nut-on-whit.webp",
				"alt": "A stainless steel formed part (sleeve nut) on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/19-bent-metal-component.webp",
				"alt": "Bent metal component"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/20-metal-hook-bracket-with-a-curved-end-and-two-scr.webp",
				"alt": "Metal hook bracket with a curved end and two screw holes, designed for mounting, on a white background."
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/21-metal-bracket-with-multiple-rectangular-and-keyh.webp",
				"alt": "Metal bracket with multiple rectangular and keyhole cutouts, labeled K1 to K5, on a white background."
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/22-example-of-a-metal-punched-and-bent-part-a-clamp.webp",
				"alt": "Example of a metal punched and bent part (a clamp) on white background"
			}
		],
		"thumbs": [
			{
				"src": "/images/special-parts-and-custom-fasteners/08-cnc-turned-cylinder-metal.webp",
				"alt": "CNC turned cylinder metal"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/09-a-metal-special-part-base-plate-created-by-cnc-m.webp",
				"alt": "A metal special part (base plate), created by cnc machining"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/10-a-black-turned-part-lying-on-white-background.webp",
				"alt": "A black turned part, lying on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/11-a-stainless-steel-swivel-arm-special-part.webp",
				"alt": "A Stainless Steel Swivel Arm special part"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/12-a-stainless-steel-turned-part-sleeve-guide.webp",
				"alt": "A stainless steel turned part sleeve guide"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/13-a-white-lateral-guidance-part.webp",
				"alt": "A white lateral guidance part"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/14-a-brass-grid-bolt-as-an-example-for-a-bossard-sp.webp",
				"alt": "A brass grid bolt as an example for a Bossard special part"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/15-a-black-bearing-bolt-on-white-background.webp",
				"alt": "A black bearing bolt on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/16-a-dark-blue-spacer-screw-on-white-background.webp",
				"alt": "A dark blue spacer screw on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/17-close-up-of-a-stainless-steel-shoulder-screw-on-.webp",
				"alt": "Close-up of a stainless steel shoulder screw on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/18-a-stainless-steel-formed-part-sleeve-nut-on-whit.webp",
				"alt": "A stainless steel formed part (sleeve nut) on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/19-bent-metal-component.webp",
				"alt": "Bent metal component"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/20-metal-hook-bracket-with-a-curved-end-and-two-scr.webp",
				"alt": "Metal hook bracket with a curved end and two screw holes, designed for mounting, on a white background."
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/21-metal-bracket-with-multiple-rectangular-and-keyh.webp",
				"alt": "Metal bracket with multiple rectangular and keyhole cutouts, labeled K1 to K5, on a white background."
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/22-example-of-a-metal-punched-and-bent-part-a-clamp.webp",
				"alt": "Example of a metal punched and bent part (a clamp) on white background"
			}
		],
		"dialog": {
			"image": {
				"src": "/images/special-parts-and-custom-fasteners/08-cnc-turned-cylinder-metal.webp",
				"alt": "CNC turned cylinder metal",
				"w": 1300,
				"h": 731
			},
			"caption": ""
		}
	},
	"coatings": {
		"heading": "Functional Coatings and Mechanical Finishing Treatments",
		"items": [
			{
				"title": "Surface Treatments",
				"body": [
					{
						"kind": "p",
						"text": "Want to increase process reliability and reduce the overall cost of a connection? For this purpose, we offer more than 150 different coatings and post-treatments."
					},
					{
						"kind": "p",
						"text": "Corrosion protection, friction coefficient optimization, appearance, or increased wear resistance – all of this can be achieved with the right surface treatment. Our experts help you choose the right solution for your product."
					},
					{
						"kind": "p",
						"text": ""
					}
				],
				"image": {
					"src": "/images/special-parts-and-custom-fasteners/40-two-sets-of-screws-and-washers-one-with-a-black-.webp",
					"alt": "Two sets of screws and washers, one with a black coating and one with a grey coating, on a white background.",
					"w": 396,
					"h": 317
				},
				"dialogImage": {
					"src": "/images/special-parts-and-custom-fasteners/40-two-sets-of-screws-and-washers-one-with-a-black-.webp",
					"alt": "Two sets of screws and washers, one with a black coating and one with a grey coating, on a white background.",
					"w": 1300,
					"h": 731
				},
				"caption": "Coatings - Lubrication for higher process security and efficiency"
			},
			{
				"title": "Mechanical Finishing Treatments",
				"body": [
					{
						"kind": "p",
						"text": "Mechanical reworking of catalogue or standard elements is often the fastest and most cost-effective solution for small and medium quantities."
					}
				],
				"image": {
					"src": "/images/special-parts-and-custom-fasteners/43-a-screw-standing-on-its-head-showcasing-a-drille.webp",
					"alt": "A screw standing on its head, showcasing a drilled hole",
					"w": 396,
					"h": 317
				},
				"dialogImage": {
					"src": "/images/special-parts-and-custom-fasteners/43-a-screw-standing-on-its-head-showcasing-a-drille.webp",
					"alt": "A screw standing on its head, showcasing a drilled hole",
					"w": 1300,
					"h": 731
				},
				"caption": ""
			},
			{
				"title": "Functional Coatings",
				"body": [
					{
						"kind": "p",
						"text": "Functional coatings are system solutions for fastening elements that are exposed to mechanical stress, such as screws and nuts. Depending on the coating, they provide a locking, securing (captive), holding, or sealing function."
					},
					{
						"kind": "p",
						"text": ""
					}
				],
				"image": {
					"src": "/images/special-parts-and-custom-fasteners/46-selection-of-functional-coatings.webp",
					"alt": "Selection of functional coatings",
					"w": 396,
					"h": 317
				},
				"dialogImage": {
					"src": "/images/special-parts-and-custom-fasteners/46-selection-of-functional-coatings.webp",
					"alt": "Selection of functional coatings",
					"w": 1300,
					"h": 731
				},
				"caption": "Selection of functional coatings"
			}
		]
	},
	"finish": {
		"heading": "What to Know About the Final Finish",
		"cta": {
			"label": "Learn More",
			"href": "/global-en/product-solutions/components-specific-solutions/fastener-coatings/"
		}
	},
	"services": {
		"heading": "Other Custom Services",
		"items": [
			{
				"title": "Assemblies",
				"body": [
					{
						"kind": "p",
						"text": "Procure fully assembled and tested assemblies in your desired packaging – from simple mini-assemblies to electro-mechanical units. This allows you to eliminate process steps and focus on your specific know-how in the final assembly."
					}
				],
				"image": null,
				"dialogImage": null,
				"caption": ""
			},
			{
				"title": "Mounting and Accessory Kits",
				"body": [
					{
						"kind": "p",
						"text": "In addition to assemblies, we also make kits. We supply you with kits of the most varied components, accurately counted, neatly packed and labeled, or printed according to your specifications."
					}
				],
				"image": null,
				"dialogImage": null,
				"caption": ""
			}
		]
	},
	"rail2": {
		"slides": [
			{
				"src": "/images/special-parts-and-custom-fasteners/49-an-assembly-made-up-of-different-component-parts.webp",
				"alt": "An assembly made up of different component parts on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/50-a-detection-pin-assembly-made-up-of-four-compone.webp",
				"alt": "A detection pin assembly, made up of four components"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/51-an-assembly-of-a-slider-consisting-of-three-comp.webp",
				"alt": "An assembly of a slider, consisting of three component parts"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/52-example-of-a-more-complex-assembly-made-up-of-16.webp",
				"alt": "Example of a more complex assembly made up of 16 components"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/53-a-pull-button-assembly-made-up-of-7-component-pa.webp",
				"alt": "A pull button assembly, made up of 7 component parts"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/54-an-accessory-kit-with-20-components-in-a-light-p.webp",
				"alt": "An accessory kit with 20 components in a light pink bag"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/55-mounting-kit-in-a-light-blue-bag-made-up-of-24-c.webp",
				"alt": "Mounting kit in a light blue bag, made up of 24 components in different variants"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/56-a-large-blue-plastic-box-containing-different-mo.webp",
				"alt": "A large blue plastic box containing different mounting sets and accessory kits"
			}
		],
		"thumbs": [
			{
				"src": "/images/special-parts-and-custom-fasteners/49-an-assembly-made-up-of-different-component-parts.webp",
				"alt": "An assembly made up of different component parts on white background"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/50-a-detection-pin-assembly-made-up-of-four-compone.webp",
				"alt": "A detection pin assembly, made up of four components"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/51-an-assembly-of-a-slider-consisting-of-three-comp.webp",
				"alt": "An assembly of a slider, consisting of three component parts"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/52-example-of-a-more-complex-assembly-made-up-of-16.webp",
				"alt": "Example of a more complex assembly made up of 16 components"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/53-a-pull-button-assembly-made-up-of-7-component-pa.webp",
				"alt": "A pull button assembly, made up of 7 component parts"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/54-an-accessory-kit-with-20-components-in-a-light-p.webp",
				"alt": "An accessory kit with 20 components in a light pink bag"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/55-mounting-kit-in-a-light-blue-bag-made-up-of-24-c.webp",
				"alt": "Mounting kit in a light blue bag, made up of 24 components in different variants"
			},
			{
				"src": "/images/special-parts-and-custom-fasteners/56-a-large-blue-plastic-box-containing-different-mo.webp",
				"alt": "A large blue plastic box containing different mounting sets and accessory kits"
			}
		],
		"dialog": {
			"image": {
				"src": "/images/special-parts-and-custom-fasteners/49-an-assembly-made-up-of-different-component-parts.webp",
				"alt": "An assembly made up of different component parts on white background",
				"w": 1300,
				"h": 731
			},
			"caption": ""
		}
	},
	"cta": {
		"heading": "You Need Special Parts?",
		"text": "Let's talk about your specific requirements. Together, we'll find the best solution for you.",
		"image": {
			"src": "/images/special-parts-and-custom-fasteners/67-woman-in-business-attire-holding-a-screw-in-her-.webp",
			"alt": "Woman in business attire holding a screw in her hand",
			"w": 740,
			"h": 555
		},
		"form": {
			"title": "Contact Us",
			"note": "Please complete the form. *fields are required.",
			"countries": [
				"Select",
				"Other country",
				"Albania",
				"Argentina",
				"Australia",
				"Austria",
				"Belarus",
				"Belgium",
				"Bosnia and Herzegovina",
				"Brazil",
				"Bulgaria",
				"Canada",
				"China",
				"Croatia",
				"Czech Republic",
				"Denmark",
				"Egypt",
				"Estonia",
				"Finland",
				"France",
				"Germany",
				"Greece",
				"Hungary",
				"Iceland",
				"India",
				"Ireland",
				"Israel",
				"Italy",
				"Latvia",
				"Lithuania",
				"Malaysia",
				"Mexico",
				"Moldova",
				"Netherlands",
				"North Macedonia",
				"Norway",
				"Poland",
				"Portugal",
				"Republic of Korea",
				"Romania",
				"Serbia",
				"Singapore",
				"Slovakia",
				"Slovenia",
				"South Africa",
				"Spain",
				"Sweden",
				"Switzerland",
				"Taiwan",
				"Thailand",
				"Turkey",
				"Ukraine",
				"United Kingdom",
				"United States",
				"Vietnam"
			],
			"fields": [
				"First Name",
				"Last Name",
				"E-Mail",
				"Company",
				"Zip Code"
			],
			"messageLabel": "Your Message",
			"consent": "By submitting this form I consent to the privacy policy. This site is protected by reCAPTCHA.",
			"consentHref": "/global-en/privacy-policy/",
			"submit": "Submit"
		}
	},
	"brochure": {
		"title": "Bossard Special Parts Brochure",
		"text": "Added value from one source – get an overview of your custom fastener options at Bossard.",
		"thumb": {
			"src": "/images/special-parts-and-custom-fasteners/68-thumbnail-bossard-special-parts-brochure.webp",
			"alt": "Thumbnail Bossard Special Parts Brochure",
			"w": 105,
			"h": 140
		},
		"file": {
			"label": "1.8 MB | pdf",
			"href": "//assets.eu.ctfassets.net/0vp0u5uh75zd/4pK1dsqpmjr0jQbWbK4qR2/07f3a401641a698dd72bde0798f6aabc/Bossard_Special_Parts_EN.pdf"
		}
	}
};
