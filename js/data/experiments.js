/**
 * LASER SCIENCE & TECHNOLOGY — VIRTUAL INTERACTIVE LABORATORY
 * 100 Calibrated, Neatly Aligned & Pre-Built Optical Experiments (v2.1)
 */
(function (global) {
  'use strict';
  global.EXPERIMENTS_DB = [
  {
    "id": "exp_001",
    "num": "001",
    "title": "Law of Reflection",
    "titleAr": "قانون الانعكاس الضوئي",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Beginner",
    "time": "20 min",
    "phenomenon": "Specular reflection at dielectric & metallic planar boundary",
    "objective": "Verify that angle of incidence equals angle of reflection (θi = θr) and incident, reflected rays and normal lie in the same plane.",
    "theory": "According to Fermat's principle of least time, specular reflection at a planar boundary requires θ_i = θ_r.",
    "equations": [
      {
        "latex": "\\theta_r = \\theta_i",
        "label": "Law of Reflection",
        "desc": "Angle of incidence equals angle of reflection"
      }
    ],
    "defaultParams": {
      "wavelength": 632.8,
      "power": 5,
      "incidentAngle": 45,
      "mirrorReflectivity": 0.99
    },
    "quiz": [
      {
        "q": "What is the angle of reflection if incident angle is 45°?",
        "qAr": "ما هي زاوية الانعكاس إذا كانت زاوية السقوط 45 درجة؟",
        "options": [
          "45°",
          "90°",
          "0°",
          "180°"
        ],
        "correct": 0,
        "explanation": "By the law of reflection, θr = θi = 45°."
      }
    ],
    "components": [
      {
        "id": "e1_l",
        "type": "laser",
        "name": "He-Ne Laser (632.8 nm)",
        "position": {
          "x": 210,
          "y": 140
        },
        "rotation": 45,
        "wavelength": 632.8,
        "power": 5,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e1_p",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 430,
          "y": 360
        },
        "rotation": 0,
        "radius": 120
      },
      {
        "id": "e1_m",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 430,
          "y": 360
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 170,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "e1_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 650,
          "y": 140
        },
        "rotation": 45,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_002",
    "num": "002",
    "title": "Law of Refraction (Snell's Law)",
    "titleAr": "قانون الانكسار الضوئي (قانون سنيل)",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Beginner",
    "time": "25 min",
    "phenomenon": "Refractive beam steering across dielectric media",
    "objective": "Verify Snell's Law n1*sin(θ1) = n2*sin(θ2) and observe directional bending of light.",
    "theory": "Light changes phase velocity from v1 = c/n1 to v2 = c/n2, bending towards the normal in denser media.",
    "equations": [
      {
        "latex": "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)",
        "label": "Snell's Law",
        "desc": "Refraction equation connecting incident and refracted angles"
      }
    ],
    "defaultParams": {
      "wavelength": 532,
      "incidentAngle": 30,
      "n1": 1,
      "n2": 1.5168
    },
    "quiz": [
      {
        "q": "When light enters a medium with higher n, the ray bends:",
        "qAr": "عندما يدخل الضوء وسطاً ذي معامل انكسار أعلى، ينكسر الشعاع:",
        "options": [
          "Towards the normal",
          "Away from the normal",
          "Unchanged",
          "Reflects totally"
        ],
        "correct": 0,
        "explanation": "Since n1*sin(θ1) = n2*sin(θ2), if n2 > n1 then sin(θ2) < sin(θ1), so θ2 < θ1."
      }
    ],
    "components": [
      {
        "id": "e2_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 155,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 632.8,
        "power": 5,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e2_p",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 350,
          "y": 262
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "e2_m",
        "type": "medium",
        "name": "Optical Glass Slab",
        "position": {
          "x": 440,
          "y": 280
        },
        "rotation": 0,
        "width": 180,
        "height": 160,
        "refractiveIndex": 1.52,
        "absorptionCoefficient": 0
      },
      {
        "id": "e2_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 685,
          "y": 378
        },
        "rotation": 114,
        "width": 100
      }
    ]
  },
  {
    "id": "exp_003",
    "num": "003",
    "title": "Total Internal Reflection (TIR)",
    "titleAr": "الانعكاس الكلي الداخلي",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "25 min",
    "phenomenon": "Evanescent wave formation and 100% boundary reflection",
    "objective": "Determine conditions for complete internal reflection without transmitted propagating wave.",
    "theory": "For n1 > n2, at angles θ1 >= θc = arcsin(n2/n1), total reflection occurs and an evanescent wave penetrates a fraction of a wavelength.",
    "equations": [
      {
        "latex": "\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)",
        "label": "Critical Angle",
        "desc": "Threshold angle for TIR"
      }
    ],
    "defaultParams": {
      "incidentAngle": 43,
      "n1": 1.5168,
      "n2": 1
    },
    "quiz": [
      {
        "q": "What is the critical angle for glass (n=1.50) in air (n=1.00)?",
        "qAr": "ما هي الزاوية الحرجة للزجاج (1.50) في الهواء (1.00)؟",
        "options": [
          "41.8°",
          "30.0°",
          "48.6°",
          "60.0°"
        ],
        "correct": 0,
        "explanation": "θc = arcsin(1.0/1.5) ≈ 41.8°."
      }
    ],
    "components": [
      {
        "id": "e3_l",
        "type": "laser",
        "name": "Green Laser (532 nm)",
        "position": {
          "x": 145,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 5,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e3_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 405,
          "y": 280
        },
        "rotation": 18,
        "prismType": "triangular",
        "size": 145,
        "refractiveIndex": 1.65
      },
      {
        "id": "e3_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 665,
          "y": 335
        },
        "rotation": 90,
        "width": 210
      }
    ]
  },
  {
    "id": "exp_004",
    "num": "004",
    "title": "Critical Angle Measurement",
    "titleAr": "قياس الزاوية الحرجة للمواد البصرية",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Critical boundary refraction threshold",
    "objective": "Accurately measure critical angle to deduce refractive index n = 1/sin(θc).",
    "theory": "By observing grazing refraction at 90°, critical angle gives n1 = n2/sin(θc).",
    "equations": [
      {
        "latex": "n_1 = \\frac{n_2}{\\sin(\\theta_c)}",
        "label": "Index from θc",
        "desc": "Calculates material refractive index"
      }
    ],
    "defaultParams": {
      "incidentAngle": 41.8,
      "n1": 1.5,
      "n2": 1
    },
    "quiz": [],
    "components": [
      {
        "id": "e4_w",
        "type": "white_light",
        "name": "White Light Lamp",
        "position": {
          "x": 140,
          "y": 285
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 12,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e4_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": 12,
        "prismType": "triangular",
        "size": 145,
        "refractiveIndex": 1.66
      },
      {
        "id": "e4_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 690,
          "y": 330
        },
        "rotation": 90,
        "width": 240
      }
    ]
  },
  {
    "id": "exp_005",
    "num": "005",
    "title": "Plane Mirror Imaging",
    "titleAr": "تكون الصور في المرآة المستوية",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Beginner",
    "time": "20 min",
    "phenomenon": "Virtual upright image formation with unity magnification",
    "objective": "Verify that image distance equals object distance (di = -do) with lateral inversion.",
    "theory": "Rays reflect such that virtual image forms behind the mirror plane at di = -do with M = +1.",
    "equations": [
      {
        "latex": "d_i = -d_o, \\quad M = +1.0",
        "label": "Plane Mirror Conjugate",
        "desc": "Image distance equals negative object distance"
      }
    ],
    "defaultParams": {
      "objectDistance": 50,
      "objectHeight": 20
    },
    "quiz": [],
    "components": [
      {
        "id": "e5_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 180,
          "y": 170
        },
        "rotation": 30,
        "wavelength": 632.8,
        "power": 5,
        "beamWidth": 22,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e5_m",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 430,
          "y": 320
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 170,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "e5_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 670,
          "y": 175
        },
        "rotation": 120,
        "width": 140
      }
    ]
  },
  {
    "id": "exp_006",
    "num": "006",
    "title": "Concave Mirror Imaging",
    "titleAr": "تكون الصور في المرآة المقعرة",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Real and virtual image formation by converging spherical reflector",
    "objective": "Verify 1/f = 1/do + 1/di and transition between real and virtual images.",
    "theory": "For concave mirror f = R/2 > 0. When do > f, a real inverted image forms.",
    "equations": [
      {
        "latex": "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}",
        "label": "Mirror Equation",
        "desc": "Relates focal length to object and image distances"
      }
    ],
    "defaultParams": {
      "focalLength": 100,
      "objectDistance": 180,
      "objectHeight": 15
    },
    "quiz": [],
    "components": [
      {
        "id": "e6_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 140,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 5,
        "beamWidth": 56,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "e6_m",
        "type": "mirror",
        "name": "concave Mirror",
        "position": {
          "x": 580,
          "y": 280
        },
        "rotation": 270,
        "mirrorType": "concave",
        "width": 145,
        "reflectivity": 0.99,
        "focalLength": 175
      }
    ]
  },
  {
    "id": "exp_007",
    "num": "007",
    "title": "Convex Mirror Imaging",
    "titleAr": "تكون الصور في المرآة المحدبة",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Beginner",
    "time": "20 min",
    "phenomenon": "Diminished virtual image formation across wide field of view",
    "objective": "Confirm convex mirrors always produce diminished virtual upright images.",
    "theory": "Since f < 0, image distance di is always negative and magnification 0 < M < 1.",
    "equations": [
      {
        "latex": "\\frac{1}{d_i} = -\\frac{1}{|f|} - \\frac{1}{d_o}",
        "label": "Convex Mirror",
        "desc": "Always yields negative image distance"
      }
    ],
    "defaultParams": {
      "focalLength": -100,
      "objectDistance": 150,
      "objectHeight": 20
    },
    "quiz": [],
    "components": [
      {
        "id": "e7_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 140,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 5,
        "beamWidth": 48,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "e7_m",
        "type": "mirror",
        "name": "convex Mirror",
        "position": {
          "x": 560,
          "y": 280
        },
        "rotation": 270,
        "mirrorType": "convex",
        "width": 145,
        "reflectivity": 0.99,
        "focalLength": 160
      }
    ]
  },
  {
    "id": "exp_008",
    "num": "008",
    "title": "Thin Lens Equation & Conjugates",
    "titleAr": "معادلة العدسات الرقيقة والنقاط المترافقة",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Beginner",
    "time": "25 min",
    "phenomenon": "Refractive paraxial image convergence",
    "objective": "Verify 1/f = 1/do + 1/di and lateral magnification M = -di/do.",
    "theory": "Gaussian thin lens conjugate equation in paraxial approximation.",
    "equations": [
      {
        "latex": "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}",
        "label": "Thin Lens Formula",
        "desc": "Gaussian conjugate relation"
      }
    ],
    "defaultParams": {
      "focalLength": 100,
      "objectDistance": 150,
      "objectHeight": 20
    },
    "quiz": [],
    "components": [
      {
        "id": "e8_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 5,
        "beamWidth": 44,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "e8_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 365,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 180,
        "diameter": 115,
        "refractiveIndex": 1.52
      },
      {
        "id": "e8_r",
        "type": "ruler",
        "name": "Optical Ruler",
        "position": {
          "x": 365,
          "y": 375
        },
        "rotation": 0,
        "length": 200
      },
      {
        "id": "e8_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 545,
          "y": 280
        },
        "rotation": 90,
        "width": 150
      }
    ]
  },
  {
    "id": "exp_009",
    "num": "009",
    "title": "Convex Lens Imaging & Aberrations",
    "titleAr": "تكون الصور في العدسات المحدبة والزيغ البصري",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Real inverted focal convergence and marginal ray spherical aberration",
    "objective": "Examine focal shifts and longitudinal spherical aberration as aperture increases.",
    "theory": "Marginal rays refract more strongly than paraxial rays, causing focal blur.",
    "equations": [
      {
        "latex": "\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",
        "label": "Lens Maker Formula",
        "desc": "Focal length from radii and index"
      }
    ],
    "defaultParams": {
      "focalLength": 120,
      "objectDistance": 240,
      "apertureRadius": 12
    },
    "quiz": [],
    "components": [
      {
        "id": "e9_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 115,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 5,
        "beamWidth": 54,
        "rayCount": 7,
        "isOn": true
      },
      {
        "id": "e9_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 165,
        "diameter": 120,
        "refractiveIndex": 1.54
      },
      {
        "id": "e9_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 560,
          "y": 280
        },
        "rotation": 90,
        "width": 160
      }
    ]
  },
  {
    "id": "exp_010",
    "num": "010",
    "title": "Concave Lens Divergence & Virtual Focus",
    "titleAr": "العدسة المقعرة وتشتيت الحزمة والبؤرة الخيالية",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "25 min",
    "phenomenon": "Divergent wavefront curvature modification",
    "objective": "Determine negative focal length using auxiliary converging lens.",
    "theory": "Total power P = P1 + P2 = 1/f1 + 1/f2 enables measuring negative lens focus.",
    "equations": [
      {
        "latex": "P_{total} = \\frac{1}{f_1} + \\frac{1}{f_2}",
        "label": "Lens Combination Power",
        "desc": "Sum of powers for lenses in contact"
      }
    ],
    "defaultParams": {
      "f1": 100,
      "f2": -75,
      "objectDistance": 200
    },
    "quiz": [],
    "components": [
      {
        "id": "e10_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 5,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "e10_f",
        "type": "lens",
        "name": "concave Lens",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 0,
        "lensType": "concave",
        "focalLength": 160,
        "diameter": 115,
        "refractiveIndex": 1.52
      },
      {
        "id": "e10_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 640,
          "y": 280
        },
        "rotation": 90,
        "width": 220
      }
    ]
  },
  {
    "id": "exp_011",
    "num": "011",
    "title": "Optical Prism Dispersion & Cauchy Model",
    "titleAr": "تشتت الضوء في المنشور الزجاجي ومعادلة كوشي",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Wavelength-dependent refraction and minimum angle of deviation",
    "objective": "Measure minimum deviation angle δm and determine Cauchy dispersion coefficients.",
    "theory": "Refractive index varies with wavelength: n(λ) = A + B/λ^2. At minimum deviation n = sin((α+δm)/2)/sin(α/2).",
    "equations": [
      {
        "latex": "n(\\lambda) = A + \\frac{B}{\\lambda^2}",
        "label": "Cauchy Dispersion",
        "desc": "Index variation across visible spectrum"
      }
    ],
    "defaultParams": {
      "apexAngle": 60,
      "cauchyA": 1.7,
      "cauchyB": 0.012,
      "incidentAngle": 48
    },
    "quiz": [],
    "components": [
      {
        "id": "e11_w",
        "type": "white_light",
        "name": "White Light Lamp",
        "position": {
          "x": 135,
          "y": 285
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 12,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e11_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": 12,
        "prismType": "triangular",
        "size": 145,
        "refractiveIndex": 1.66
      },
      {
        "id": "e11_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 690,
          "y": 330
        },
        "rotation": 90,
        "width": 240
      }
    ]
  },
  {
    "id": "exp_012",
    "num": "012",
    "title": "Refractive Index Measurement by Apparent Depth",
    "titleAr": "قياس معامل الانكسار بطريقة العمق الظاهري",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Beginner",
    "time": "20 min",
    "phenomenon": "Apparent optical displacement at planar dielectric boundary",
    "objective": "Measure real and apparent thickness to deduce refractive index n = d_real / d_apparent.",
    "theory": "Paraxial rays refract into air with apparent depth reduced by factor 1/n.",
    "equations": [
      {
        "latex": "n = \\frac{d_{real}}{d_{apparent}}",
        "label": "Apparent Depth Ratio",
        "desc": "Index from microscope depth readings"
      }
    ],
    "defaultParams": {
      "realThickness": 20,
      "materialIndex": 1.52
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_012_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 6,
        "beamWidth": 30,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_012_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 340,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 190,
        "diameter": 104,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_012_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 525,
          "y": 280
        },
        "rotation": 45,
        "mirrorType": "partial",
        "width": 110,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_012_d1",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      },
      {
        "id": "exp_012_d2",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 525,
          "y": 445
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_013",
    "num": "013",
    "title": "Numerical Aperture (NA) of Optical Systems",
    "titleAr": "الفتحة العددية (NA) للمنظومات البصرية",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Light-gathering capacity and acceptance cone angle",
    "objective": "Measure emission cone angle and determine NA = n * sin(θ_max).",
    "theory": "NA characterizes cone angle over which system accepts/emits light: NA = sqrt(n_core^2 - n_clad^2).",
    "equations": [
      {
        "latex": "\\text{NA} = \\sqrt{n_{core}^2 - n_{clad}^2}",
        "label": "Numerical Aperture",
        "desc": "Core-cladding index difference metric"
      }
    ],
    "defaultParams": {
      "nCore": 1.48,
      "nClad": 1.46,
      "distanceToScreen": 100
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_013_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 5,
        "beamWidth": 24,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "exp_013_ap",
        "type": "aperture",
        "name": "Circular Aperture",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "slitWidth": 22
      },
      {
        "id": "exp_013_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 230
      }
    ]
  },
  {
    "id": "exp_014",
    "num": "014",
    "title": "Optical Fiber Light Guidance",
    "titleAr": "توجيه الضوء في الألياف البصرية بالانعكاس الكلي",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Multi-bounce total internal reflection within waveguide core",
    "objective": "Demonstrate guided propagation and examine coupling efficiency vs alignment.",
    "theory": "Rays launched within acceptance angle undergo repeated TIR down the fiber core.",
    "equations": [
      {
        "latex": "\\theta_{acc} = \\arcsin(\\text{NA})",
        "label": "Acceptance Angle",
        "desc": "Maximum launch angle for guided rays"
      }
    ],
    "defaultParams": {
      "launchAngle": 5,
      "nCore": 1.48,
      "nClad": 1.46
    },
    "quiz": [],
    "components": [
      {
        "id": "e14_l",
        "type": "laser",
        "name": "Green Laser (532 nm)",
        "position": {
          "x": 110,
          "y": 260
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 8,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e14_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 210,
          "y": 260
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 95,
        "diameter": 72,
        "refractiveIndex": 1.52
      },
      {
        "id": "e14_fib",
        "type": "fiber",
        "name": "Flexible Optical Fiber",
        "position": {
          "x": 450,
          "y": 270
        },
        "rotation": 0,
        "coreIndex": 1.5,
        "claddingIndex": 1.44,
        "coreDiameter": 24,
        "claddingDiameter": 40,
        "points": [
          {
            "x": 270,
            "y": 260
          },
          {
            "x": 380,
            "y": 165
          },
          {
            "x": 500,
            "y": 365
          },
          {
            "x": 630,
            "y": 280
          }
        ]
      },
      {
        "id": "e14_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 730,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_015",
    "num": "015",
    "title": "Fiber Macro & Micro-Bending Loss",
    "titleAr": "خسائر الانحناء الكلي والدقيق في الألياف البصرية",
    "category": "fundamental",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Radiation leakage caused by curvature-induced critical angle reduction",
    "objective": "Quantify loss in dB as bend radius decreases, verifying exponential leakage.",
    "theory": "Fiber curvature lowers boundary incidence angle, leaking power into cladding.",
    "equations": [
      {
        "latex": "\\text{Loss(dB)} = 10 \\log_{10}(P_{in}/P_{out})",
        "label": "Decibel Loss",
        "desc": "Power attenuation in dB"
      }
    ],
    "defaultParams": {
      "inputPower": 10,
      "bendRadius": 15,
      "turns": 3
    },
    "quiz": [],
    "components": [
      {
        "id": "e15_l",
        "type": "laser",
        "name": "Diode Laser (650 nm)",
        "position": {
          "x": 110,
          "y": 290
        },
        "rotation": -4,
        "wavelength": 650,
        "power": 8,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e15_fib",
        "type": "fiber",
        "name": "Flexible Optical Fiber",
        "position": {
          "x": 443,
          "y": 275
        },
        "rotation": 0,
        "coreIndex": 1.52,
        "claddingIndex": 1.44,
        "coreDiameter": 24,
        "claddingDiameter": 40,
        "points": [
          {
            "x": 250,
            "y": 280
          },
          {
            "x": 365,
            "y": 385
          },
          {
            "x": 505,
            "y": 175
          },
          {
            "x": 635,
            "y": 270
          }
        ]
      },
      {
        "id": "e15_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 735,
          "y": 270
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_016",
    "num": "016",
    "title": "Young's Double-Slit Experiment",
    "titleAr": "تجربة شقي يونغ (التداخل الضوئي الثنائي)",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Wavefront splitting interference and fringe spatial modulation",
    "objective": "Measure fringe separation and calculate wavelength λ = d*Δy / L.",
    "theory": "Constructive interference occurs when path difference d*sin(θ) = m*λ, giving fringe spacing Δy = λL/d.",
    "equations": [
      {
        "latex": "\\Delta y = \\frac{\\lambda L}{d}",
        "label": "Fringe Spacing",
        "desc": "Distance between consecutive bright fringes"
      }
    ],
    "defaultParams": {
      "wavelength": 632.8,
      "slitDistance": 0.25,
      "slitWidth": 0.04,
      "screenDistance": 1000
    },
    "quiz": [],
    "components": [
      {
        "id": "e16_l",
        "type": "laser",
        "name": "Green Laser (532 nm)",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 5,
        "beamWidth": 34,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "e16_s",
        "type": "double_slit",
        "name": "Young Double Slit",
        "position": {
          "x": 355,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "slitSpacing": 26,
        "slitWidth": 10
      },
      {
        "id": "e16_scr",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 685,
          "y": 280
        },
        "rotation": 90,
        "width": 250
      }
    ]
  },
  {
    "id": "exp_017",
    "num": "017",
    "title": "Single-Slit Fraunhofer Diffraction",
    "titleAr": "حيود فراونهوفر من شق مفرد",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Far-field diffraction pattern and sinc-squared intensity distribution",
    "objective": "Verify diffraction minima occur at a*sin(θ) = m*λ and map sinc^2 profile.",
    "theory": "Fraunhofer diffraction across slit of width a produces I(θ) = I0 * sinc^2(π*a*sin(θ)/λ).",
    "equations": [
      {
        "latex": "a \\sin(\\theta_m) = m \\lambda",
        "label": "Diffraction Minima",
        "desc": "Positions of dark fringes"
      }
    ],
    "defaultParams": {
      "wavelength": 532,
      "slitWidth": 0.08,
      "screenDistance": 1200
    },
    "quiz": [],
    "components": [
      {
        "id": "e17_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 5,
        "beamWidth": 16,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e17_s",
        "type": "single_slit",
        "name": "Single Slit",
        "position": {
          "x": 355,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "slitWidth": 18
      },
      {
        "id": "e17_scr",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 685,
          "y": 280
        },
        "rotation": 90,
        "width": 230
      }
    ]
  },
  {
    "id": "exp_018",
    "num": "018",
    "title": "Multiple-Slit Diffraction (N-Slits)",
    "titleAr": "حيود الشقوق المتعددة (N-Slits)",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Advanced",
    "time": "35 min",
    "phenomenon": "Transition from interference fringes to sharp grating peaks",
    "objective": "Observe peak sharpening proportional to N^2 and (N-1) intermediate minima.",
    "theory": "For N coherent slits, intensity factor is [sin(Nγ)/sin(γ)]^2.",
    "equations": [
      {
        "latex": "I(\\theta) \\propto \\left(\\frac{\\sin(N\\gamma)}{\\sin\\gamma}\\right)^2",
        "label": "N-Slit Factor",
        "desc": "Interference factor for N slits"
      }
    ],
    "defaultParams": {
      "N": 4,
      "slitDistance": 0.15,
      "slitWidth": 0.03,
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "e18_w",
        "type": "white_light",
        "name": "White Light Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e18_g",
        "type": "grating",
        "name": "Diffraction Grating",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "gratingDensity": 600
      },
      {
        "id": "e18_scr",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 685,
          "y": 280
        },
        "rotation": 90,
        "width": 270
      }
    ]
  },
  {
    "id": "exp_019",
    "num": "019",
    "title": "Diffraction Grating & Spectrometry",
    "titleAr": "محزوز الحيود والمطيافية الضوئية",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "High-resolution angular spectral dispersion into discrete orders",
    "objective": "Determine wavelengths using d*sin(θ) = m*λ and evaluate resolving power R = m*N.",
    "theory": "Diffraction grating separates wavelengths according to grating equation d*sin(θ) = m*λ.",
    "equations": [
      {
        "latex": "d \\sin(\\theta_m) = m \\lambda",
        "label": "Grating Equation",
        "desc": "Relates pitch d, order m, and angle θ"
      }
    ],
    "defaultParams": {
      "groovesPerMm": 600,
      "wavelength": 632.8,
      "order": 1
    },
    "quiz": [],
    "components": [
      {
        "id": "e19_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 140,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e19_bs",
        "type": "mirror",
        "name": "Beam Splitter 50/50",
        "position": {
          "x": 395,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "e19_m1",
        "type": "mirror",
        "name": "Fixed Mirror M1",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "e19_m2",
        "type": "mirror",
        "name": "Movable Mirror M2",
        "position": {
          "x": 395,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "e19_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 395,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_020",
    "num": "020",
    "title": "Fresnel Near-Field Diffraction & Arago Spot",
    "titleAr": "حيود فرينل للمجال القريب ونقطة أراغو المضيئة",
    "category": "wave_optics",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Near-field wavefront curvature and constructive central Poisson-Arago spot",
    "objective": "Demonstrate Fresnel zone number NF = a^2/(λ*z) and observe Poisson's bright spot.",
    "theory": "When NF >= 1, obstacle symmetry brings boundary wavelets into phase at the axis shadow center.",
    "equations": [
      {
        "latex": "N_F = \\frac{a^2}{\\lambda z}",
        "label": "Fresnel Number",
        "desc": "Delineates near-field from far-field"
      }
    ],
    "defaultParams": {
      "apertureRadius": 0.5,
      "distanceZ": 200,
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "e20_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 110,
          "y": 340
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e20_bs1",
        "type": "mirror",
        "name": "BS1 50/50",
        "position": {
          "x": 270,
          "y": 340
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 100,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "e20_m1",
        "type": "mirror",
        "name": "Mirror M1",
        "position": {
          "x": 270,
          "y": 160
        },
        "rotation": -45,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "e20_m2",
        "type": "mirror",
        "name": "Mirror M2",
        "position": {
          "x": 550,
          "y": 340
        },
        "rotation": -45,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "e20_bs2",
        "type": "mirror",
        "name": "BS2 50/50",
        "position": {
          "x": 550,
          "y": 160
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 100,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "e20_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 705,
          "y": 160
        },
        "rotation": 90,
        "width": 88
      }
    ]
  },
  {
    "id": "exp_021",
    "num": "021",
    "title": "Fraunhofer Far-Field Diffraction & Airy Disk",
    "titleAr": "حيود فراونهوفر للمجال البعيد وقرص آيري (Airy Disk)",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Circular aperture diffraction limiting optical system resolution",
    "objective": "Measure angular radius of central Airy disk θ = 1.22*λ/D.",
    "theory": "Circular aperture diffraction produces Bessel profile J1(u)/u with first dark ring at θ = 1.22*λ/D.",
    "equations": [
      {
        "latex": "\\theta_{Airy} = 1.22 \\frac{\\lambda}{D}",
        "label": "Airy Disk Radius",
        "desc": "Diffraction limit for circular aperture"
      }
    ],
    "defaultParams": {
      "diameterD": 0.2,
      "wavelength": 632.8,
      "focalLength": 500
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_021_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 5,
        "beamWidth": 24,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "exp_021_ap",
        "type": "aperture",
        "name": "Circular Aperture",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "slitWidth": 22
      },
      {
        "id": "exp_021_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 230
      }
    ]
  },
  {
    "id": "exp_022",
    "num": "022",
    "title": "Michelson Interferometer Metrology",
    "titleAr": "مقياس ميكلسون للتداخل الضوئي والقياسات النانوية",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "45 min",
    "phenomenon": "Amplitude-splitting two-beam interference and nanometer displacement sensing",
    "objective": "Count fringe shifts ΔN = 2*Δd/λ to measure sub-micron displacement Δd.",
    "theory": "Light splits into two arms and recombines; moving one mirror by λ/2 shifts pattern by one full fringe.",
    "equations": [
      {
        "latex": "\\Delta d = N \\left(\\frac{\\lambda}{2}\\right)",
        "label": "Displacement Equation",
        "desc": "Conversion of fringes to displacement"
      }
    ],
    "defaultParams": {
      "wavelength": 632.8,
      "mirrorDisplacement": 1.265,
      "armLength1": 100,
      "armLength2": 100
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_022_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_022_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_022_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_022_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_022_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_023",
    "num": "023",
    "title": "Mach-Zehnder Interferometer & Gas Refractometry",
    "titleAr": "مقياس ماخ-زيندر للتداخل وقياس معامل انكسار الغازات",
    "category": "wave_optics",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Isolated dual-path optical phase modulation without back-reflection",
    "objective": "Measure refractive index change of gas Δn = N*λ / L_cell as pressure varies.",
    "theory": "Dual-path configuration passes light once through sample, ideal for gas and plasma diagnostics.",
    "equations": [
      {
        "latex": "\\Delta n = \\frac{N \\lambda}{L_{cell}}",
        "label": "Gas Index Shift",
        "desc": "Refractive index change from fringe count"
      }
    ],
    "defaultParams": {
      "cellLength": 50,
      "gasPressure": 1,
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_023_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_023_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_023_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_023_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_023_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_024",
    "num": "024",
    "title": "Fabry-Pérot Interferometer & Cavity Finesse",
    "titleAr": "مقياس فابري-بيرو للتداخل وتحديد دقة الرنين (Finesse)",
    "category": "wave_optics",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Multi-beam interference between parallel high-reflectivity plates",
    "objective": "Measure Free Spectral Range (FSR) and cavity finesse F = π*sqrt(R)/(1-R).",
    "theory": "Multiple reflections create sharp Airy transmission peaks with linewidth narrowing as R -> 1.",
    "equations": [
      {
        "latex": "\\mathcal{F} = \\frac{\\pi \\sqrt{R}}{1 - R}",
        "label": "Cavity Finesse",
        "desc": "Resonator sharpness metric"
      }
    ],
    "defaultParams": {
      "mirrorReflectivity": 0.95,
      "cavitySpacing": 10,
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_024_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_024_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_024_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_024_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_024_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_025",
    "num": "025",
    "title": "Newton's Rings & Radius of Curvature",
    "titleAr": "حلقات نيوتن وقياس نصف قطر تكور العدسات",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Variable thickness air-wedge interference between lens and flat plate",
    "objective": "Measure ring diameters to deduce lens radius of curvature R = (D_{m+p}^2 - D_m^2)/(4*p*λ).",
    "theory": "Air film thickness t ≈ r^2/(2R). Phase shift at flat plate yields dark rings at r_m = sqrt(m*λ*R).",
    "equations": [
      {
        "latex": "r_m = \\sqrt{m \\lambda R}",
        "label": "Dark Ring Radius",
        "desc": "Radius of m-th dark ring"
      }
    ],
    "defaultParams": {
      "radiusCurvature": 1500,
      "wavelength": 589
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_025_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 589,
        "power": 6,
        "beamWidth": 30,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_025_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 340,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 190,
        "diameter": 104,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_025_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 525,
          "y": 280
        },
        "rotation": 45,
        "mirrorType": "partial",
        "width": 110,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_025_d1",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      },
      {
        "id": "exp_025_d2",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 525,
          "y": 445
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_026",
    "num": "026",
    "title": "Thin Film Interference & AR Coating",
    "titleAr": "تداخل الأغشية الرقيقة والطلاء المضاد للانعكاس (AR Coating)",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Phase cancellation between front and rear surface reflections",
    "objective": "Verify zero reflectance condition at design wavelength for quarter-wave film d = λ0 / (4*n).",
    "theory": "Reflections from front and back interfaces cancel destructively when optical thickness is λ/4.",
    "equations": [
      {
        "latex": "d = \\frac{\\lambda_0}{4 n_{film}}, \\quad n_{film} = \\sqrt{n_{sub}}",
        "label": "AR Coating Condition",
        "desc": "Zero reflection quarter-wave match"
      }
    ],
    "defaultParams": {
      "filmThickness": 100,
      "filmIndex": 1.38,
      "substrateIndex": 1.52,
      "wavelength": 550
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_026_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 550,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_026_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_026_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_026_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_026_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_027",
    "num": "027",
    "title": "Wedge-Shaped Film Interference",
    "titleAr": "تداخل الغشاء الإسفيني وتحديد سمك العينات الميكرونية",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "25 min",
    "phenomenon": "Straight equal-thickness localized interference fringes",
    "objective": "Determine thickness of micro-wire from fringe spacing β = λ / (2*θ).",
    "theory": "Fringes of equal thickness form parallel to wedge apex with spacing inversely proportional to wedge angle.",
    "equations": [
      {
        "latex": "t_{wire} = \\frac{\\lambda L}{2 \\beta}",
        "label": "Wire Thickness",
        "desc": "Thickness from fringe spacing β"
      }
    ],
    "defaultParams": {
      "wireThickness": 25,
      "plateLength": 100,
      "wavelength": 589
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_027_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 589,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_027_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_027_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_027_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_027_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_028",
    "num": "028",
    "title": "Optical Coherence & Fringe Visibility",
    "titleAr": "الترابط الضوئي ووضوح أهداب التداخل (Fringe Visibility)",
    "category": "wave_optics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Dependence of fringe contrast on degree of mutual coherence",
    "objective": "Calculate visibility V = (Imax - Imin)/(Imax + Imin) and link to degree of coherence.",
    "theory": "Fringe visibility measures magnitude of complex degree of temporal/spatial coherence |γ12|.",
    "equations": [
      {
        "latex": "V = \\frac{I_{max} - I_{min}}{I_{max} + I_{min}} = |\\gamma_{12}|",
        "label": "Fringe Visibility",
        "desc": "Interference contrast equation"
      }
    ],
    "defaultParams": {
      "pathDelay": 0.1,
      "coherenceLength": 5
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_028_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_028_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_028_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_028_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_028_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_029",
    "num": "029",
    "title": "Spatial Coherence & Van Cittert-Zernike Theorem",
    "titleAr": "الترابط المكاني ونظرية فان سيترت-زيرنيكي",
    "category": "wave_optics",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Spatial coherence area expansion from distant incoherent source",
    "objective": "Measure transverse spatial coherence diameter dc = 1.22*λ*R / D_source.",
    "theory": "Van Cittert-Zernike theorem states spatial coherence is Fourier transform of source intensity profile.",
    "equations": [
      {
        "latex": "d_c = 1.22 \\frac{\\lambda R}{D_{source}}",
        "label": "Spatial Coherence Width",
        "desc": "Transverse coherence diameter"
      }
    ],
    "defaultParams": {
      "sourceDiameter": 1,
      "distanceR": 1000,
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_029_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_029_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_029_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_029_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_029_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_030",
    "num": "030",
    "title": "Temporal Coherence & Spectral Linewidth",
    "titleAr": "الترابط الزماني وعرض الخط الطيفي (Linewidth)",
    "category": "wave_optics",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "35 min",
    "phenomenon": "Fourier relation between spectral bandwidth Δλ and coherence length Lc",
    "objective": "Determine coherence length Lc = λ^2 / Δλ for laser and diode sources.",
    "theory": "Coherence time τc = 1/Δν translates to path difference limit Lc = c*τc over which fringes persist.",
    "equations": [
      {
        "latex": "L_c = \\frac{\\lambda_0^2}{\\Delta \\lambda}",
        "label": "Coherence Length",
        "desc": "Inversely proportional to spectral linewidth"
      }
    ],
    "defaultParams": {
      "wavelength": 632.8,
      "linewidthDeltaLambda": 0.002
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_030_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_030_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_030_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_030_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_030_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_031",
    "num": "031",
    "title": "Linear Polarization & Extinction Ratio",
    "titleAr": "الاستقطاب الخطي ونسبة الإخماد (Extinction Ratio)",
    "category": "polarization",
    "level": "undergraduate",
    "difficulty": "Beginner",
    "time": "25 min",
    "phenomenon": "Electric field vector orientation restriction across dichroic medium",
    "objective": "Measure polarizer extinction ratio ER = T_parallel / T_crossed.",
    "theory": "Dichroic polarizer transmits E-field parallel to axis while absorbing orthogonal component.",
    "equations": [
      {
        "latex": "\\text{ER} = \\frac{I_{parallel}}{I_{crossed}}",
        "label": "Extinction Ratio",
        "desc": "Polarizer quality metric"
      }
    ],
    "defaultParams": {
      "inputPower": 10,
      "polarizerAngle1": 0,
      "polarizerAngle2": 90
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_031_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 150,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_031_pr",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 355,
          "y": 265
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "exp_031_m",
        "type": "medium",
        "name": "Optical Crystal / Plate",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "width": 175,
        "height": 150,
        "refractiveIndex": 1.54,
        "absorptionCoefficient": 0
      },
      {
        "id": "exp_031_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 375
        },
        "rotation": 114,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_032",
    "num": "032",
    "title": "Malus's Law",
    "titleAr": "قانون مالوس لشدة الضوء المستقطب",
    "category": "polarization",
    "level": "undergraduate",
    "difficulty": "Beginner",
    "time": "25 min",
    "phenomenon": "Cosine-squared transmitted intensity through analyzer",
    "objective": "Verify transmitted intensity follows I = I0 * cos^2(θ).",
    "theory": "Analyzer transmits E = E0*cos(θ), giving intensity I = E^2 = I0*cos^2(θ).",
    "equations": [
      {
        "latex": "I(\\theta) = I_0 \\cos^2(\\theta)",
        "label": "Malus's Law",
        "desc": "Transmitted intensity vs analyzer angle"
      }
    ],
    "defaultParams": {
      "i0": 10,
      "theta": 45
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_032_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 150,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 450,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_032_pr",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 355,
          "y": 265
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "exp_032_m",
        "type": "medium",
        "name": "Optical Crystal / Plate",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "width": 175,
        "height": 150,
        "refractiveIndex": 1.54,
        "absorptionCoefficient": 0
      },
      {
        "id": "exp_032_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 375
        },
        "rotation": 114,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_033",
    "num": "033",
    "title": "Brewster's Angle & Polarization by Reflection",
    "titleAr": "زاوية بروستر والاستقطاب التام بالانعكاس",
    "category": "polarization",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Zero reflectance of p-polarized wave at dielectric boundary",
    "objective": "Measure Brewster angle θB = arctan(n2/n1) where reflected light is 100% s-polarized.",
    "theory": "At Brewster's angle, reflected and refracted rays are perpendicular, suppressing p-polarization reflection.",
    "equations": [
      {
        "latex": "\\tan(\\theta_B) = \\frac{n_2}{n_1}",
        "label": "Brewster's Law",
        "desc": "Angle of zero p-reflectance"
      }
    ],
    "defaultParams": {
      "n1": 1,
      "n2": 1.5168,
      "incidentAngle": 56.6
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_033_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 150,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 532,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_033_pr",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 355,
          "y": 265
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "exp_033_m",
        "type": "medium",
        "name": "Optical Crystal / Plate",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "width": 175,
        "height": 150,
        "refractiveIndex": 1.54,
        "absorptionCoefficient": 0
      },
      {
        "id": "exp_033_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 375
        },
        "rotation": 114,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_034",
    "num": "034",
    "title": "Circular Polarization & Quarter-Wave Retardation",
    "titleAr": "الاستقطاب الدائري ولوح الربع موجة (λ/4)",
    "category": "polarization",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "90° phase shift between orthogonal equal-amplitude E-field components",
    "objective": "Convert linearly polarized light to circular polarization setting fast axis at 45°.",
    "theory": "A quarter-wave plate introduces π/2 phase delay, rotating E vector on a circle.",
    "equations": [
      {
        "latex": "\\mathbf{J} = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 \\\\ \\pm i \\end{pmatrix}",
        "label": "Circular Jones Vector",
        "desc": "Circular polarization state"
      }
    ],
    "defaultParams": {
      "waveplateAngle": 45,
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_034_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 150,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_034_pr",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 355,
          "y": 265
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "exp_034_m",
        "type": "medium",
        "name": "Optical Crystal / Plate",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "width": 175,
        "height": 150,
        "refractiveIndex": 1.54,
        "absorptionCoefficient": 0
      },
      {
        "id": "exp_034_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 375
        },
        "rotation": 114,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_035",
    "num": "035",
    "title": "Elliptical Polarization & Stokes Parameters",
    "titleAr": "الاستقطاب البيضوي ومعاملات ستوكس ومصفوفات جونز",
    "category": "polarization",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "General electromagnetic polarization state and Stokes parameters",
    "objective": "Synthesize elliptical polarization states and calculate Stokes parameters S0, S1, S2, S3.",
    "theory": "General polarization ellipse is fully characterized by four Stokes intensity parameters.",
    "equations": [
      {
        "latex": "S_0 = I, \\quad S_1 = I_0 - I_{90}, \\quad S_2 = I_{45} - I_{-45}, \\quad S_3 = I_R - I_L",
        "label": "Stokes Parameters",
        "desc": "Measurable intensity parameters"
      }
    ],
    "defaultParams": {
      "phaseShiftDelta": 60,
      "amplitudeRatio": 1.5
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_035_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 150,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 450,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_035_pr",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 355,
          "y": 265
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "exp_035_m",
        "type": "medium",
        "name": "Optical Crystal / Plate",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "width": 175,
        "height": 150,
        "refractiveIndex": 1.54,
        "absorptionCoefficient": 0
      },
      {
        "id": "exp_035_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 375
        },
        "rotation": 114,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_036",
    "num": "036",
    "title": "Quarter-Wave Plate (λ/4) Characterization",
    "titleAr": "توصيف لوح الربع موجة واختبار المحاور البلورية",
    "category": "polarization",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Quarter-wavelength optical path difference generation",
    "objective": "Identify fast and slow optical axes and verify π/2 phase delay.",
    "theory": "Birefringent thickness satisfies (ne - no)*d = λ/4.",
    "equations": [
      {
        "latex": "\\Delta \\phi = \\frac{2\\pi}{\\lambda}(n_e - n_o)d = \\frac{\\pi}{2}",
        "label": "QWP Retardation",
        "desc": "Quarter-wave phase condition"
      }
    ],
    "defaultParams": {
      "rotationAngle": 45,
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_036_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 30,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_036_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 340,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 190,
        "diameter": 104,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_036_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 525,
          "y": 280
        },
        "rotation": 45,
        "mirrorType": "partial",
        "width": 110,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_036_d1",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      },
      {
        "id": "exp_036_d2",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 525,
          "y": 445
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_037",
    "num": "037",
    "title": "Half-Wave Plate (λ/2) & Polarization Rotation",
    "titleAr": "لوح النصف موجة (λ/2) وتدوير مستوى الاستقطاب",
    "category": "polarization",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "25 min",
    "phenomenon": "Linear polarization orientation rotation by 2θ",
    "objective": "Demonstrate that rotating HWP by θ rotates polarization vector by 2θ.",
    "theory": "180° phase delay between fast and slow axes mirrors polarization vector across fast axis.",
    "equations": [
      {
        "latex": "\\theta_{out} = 2 \\theta_{plate}",
        "label": "Polarization Rotation",
        "desc": "Output angle is twice plate angle"
      }
    ],
    "defaultParams": {
      "plateAngle": 30
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_037_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 150,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_037_pr",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 355,
          "y": 265
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "exp_037_m",
        "type": "medium",
        "name": "Optical Crystal / Plate",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "width": 175,
        "height": 150,
        "refractiveIndex": 1.54,
        "absorptionCoefficient": 0
      },
      {
        "id": "exp_037_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 375
        },
        "rotation": 114,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_038",
    "num": "038",
    "title": "Optical Activity & Biot's Law in Chiral Media",
    "titleAr": "النشاطية الضوئية وقانون بيوت في المحاليل الكيرالية",
    "category": "polarization",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Continuous rotation of linear polarization in optically active liquids",
    "objective": "Measure specific rotation [α] and determine solute concentration via α = [α]*c*l.",
    "theory": "Chiral molecules exhibit circular birefringence nR != nL, rotating the linear polarization plane.",
    "equations": [
      {
        "latex": "\\alpha = [\\alpha] \\cdot c \\cdot l",
        "label": "Biot's Law",
        "desc": "Rotation angle from concentration and path length"
      }
    ],
    "defaultParams": {
      "concentration": 10,
      "pathLength": 2,
      "specificRotation": 66.5
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_038_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 450,
        "power": 6,
        "beamWidth": 30,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_038_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 340,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 190,
        "diameter": 104,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_038_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 525,
          "y": 280
        },
        "rotation": 45,
        "mirrorType": "partial",
        "width": 110,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_038_d1",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      },
      {
        "id": "exp_038_d2",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 525,
          "y": 445
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_039",
    "num": "039",
    "title": "Optical Birefringence in Calcite Crystals",
    "titleAr": "الانكسار المزدوج (Birefringence) في بلورات الكالسيت",
    "category": "polarization",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Double refraction: splitting into Ordinary (o) and Extraordinary (e) rays",
    "objective": "Observe spatial beam displacement of e-ray and verify orthogonal polarization.",
    "theory": "Ordinary ray follows Snell's law with index no; extraordinary ray follows angle-dependent index ne(θ).",
    "equations": [
      {
        "latex": "\\frac{1}{n_e^2(\\theta)} = \\frac{\\cos^2\\theta}{n_o^2} + \\frac{\\sin^2\\theta}{n_e^2}",
        "label": "Indicatrix Ellipsoid",
        "desc": "Extraordinary index vs propagation angle"
      }
    ],
    "defaultParams": {
      "crystalThickness": 20,
      "nO": 1.658,
      "nE": 1.486
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_039_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 150,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 532,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_039_pr",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 355,
          "y": 265
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "exp_039_m",
        "type": "medium",
        "name": "Optical Crystal / Plate",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "width": 175,
        "height": 150,
        "refractiveIndex": 1.54,
        "absorptionCoefficient": 0
      },
      {
        "id": "exp_039_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 375
        },
        "rotation": 114,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_040",
    "num": "040",
    "title": "Polarization Interferometry & Stress Birefringence",
    "titleAr": "تداخل الاستقطاب والتكسر المزدوج الإجهادي (Photoelasticity)",
    "category": "polarization",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Stress-induced birefringence creating chromatic isochromatic fringes",
    "objective": "Map mechanical stress distribution (σ1 - σ2) in optical components.",
    "theory": "Applied stress induces refractive index anisotropy: n1 - n2 = C*(σ1 - σ2).",
    "equations": [
      {
        "latex": "\\Delta = \\frac{2\\pi}{\\lambda} C d (\\sigma_1 - \\sigma_2)",
        "label": "Stress-Optic Law",
        "desc": "Phase retardation from principal stress difference"
      }
    ],
    "defaultParams": {
      "appliedForce": 150,
      "photoelasticConstant": 3.5e-11
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_040_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_040_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_040_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_040_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_040_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_041",
    "num": "041",
    "title": "Spontaneous Emission & Radiative Lifetime",
    "titleAr": "الانبعاث التلقائي والعمر الزمني الإشعاعي",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Probabilistic decay of excited atomic states emitting incoherent photons",
    "objective": "Measure fluorescence exponential decay I(t) = I0*exp(-t/τ) and determine upper level lifetime.",
    "theory": "Excited state population decays spontaneously at rate dN2/dt = -A21*N2 with lifetime τ = 1/A21.",
    "equations": [
      {
        "latex": "N_2(t) = N_2(0) e^{-t / \\tau_{sp}}",
        "label": "Spontaneous Decay",
        "desc": "Exponential atomic state decay"
      }
    ],
    "defaultParams": {
      "lifetimeTau": 230,
      "initialPopulation": 1000000000000000000
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_041_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_041_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_041_gain",
        "type": "gain_medium",
        "name": "Gain Medium (TI_SAPPHIRE)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ti_sapphire",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_041_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_041_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_042",
    "num": "042",
    "title": "Stimulated Emission & Coherent Amplification",
    "titleAr": "الانبعاث المحتث والتضخيم الضوئي المترابط",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Incident photon triggering identical clone photon with matching phase and frequency",
    "objective": "Demonstrate coherent gain through inverted population preserving wavelength, phase, and mode.",
    "theory": "Stimulated emission produces identical photons, resulting in exponential gain I(z) = I(0)*exp(γ*z).",
    "equations": [
      {
        "latex": "I(z) = I(0) e^{\\gamma z}",
        "label": "Small-Signal Gain",
        "desc": "Exponential beam amplification"
      }
    ],
    "defaultParams": {
      "gainCoeff": 0.15,
      "rodLength": 10,
      "inputIntensity": 5
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_042_pump",
        "type": "white_light",
        "name": "Flashlamp Pump Source",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "lampColor": "white",
        "power": 15,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "exp_042_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_042_gain",
        "type": "gain_medium",
        "name": "Gain Medium (RUBY)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ruby",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_042_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_042_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_043",
    "num": "043",
    "title": "Absorption & Emission Balance in Atomic Systems",
    "titleAr": "توازن الامتصاص والانبعاث في المنظومات الذرية",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Thermodynamic equilibrium between absorption, spontaneous, and stimulated emission",
    "objective": "Analyze Boltzmann distribution and explain why optical gain requires population inversion.",
    "theory": "In thermal equilibrium, N2/N1 = exp(-hν / (k_B*T)) << 1; resonant absorption dominates.",
    "equations": [
      {
        "latex": "\\frac{N_2}{N_1} = \\exp\\left(-\\frac{h\\nu}{k_B T}\\right)",
        "label": "Boltzmann Population",
        "desc": "Thermal population ratio"
      }
    ],
    "defaultParams": {
      "temperature": 300,
      "transitionWavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_043_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 12,
        "beamWidth": 22,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_043_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 305,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 165,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_043_t",
        "type": "medium",
        "name": "Target / Tissue Sample",
        "position": {
          "x": 495,
          "y": 280
        },
        "rotation": 0,
        "width": 130,
        "height": 110,
        "refractiveIndex": 1.44,
        "absorptionCoefficient": 1.15
      },
      {
        "id": "exp_043_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_044",
    "num": "044",
    "title": "Population Inversion & Rate Equation Dynamics",
    "titleAr": "التوزيع المعكوس (Population Inversion) وديناميكا معادلات المعدل",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Achieving non-equilibrium state N2 > N1 via external optical pumping",
    "objective": "Solve steady-state rate equations and find pump threshold for population inversion ΔN > 0.",
    "theory": "Net optical gain requires ΔN = N2 - N1 > 0, sustained by continuous energy pumping.",
    "equations": [
      {
        "latex": "\\gamma(\\nu) = \\sigma_{21} \\Delta N",
        "label": "Gain Coefficient",
        "desc": "Gain from inversion and cross-section"
      }
    ],
    "defaultParams": {
      "pumpRate": 2.5e+22,
      "crossSection": 2.8e-19,
      "lifetime": 230
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_044_pump",
        "type": "white_light",
        "name": "Flashlamp Pump Source",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "lampColor": "white",
        "power": 15,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "exp_044_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_044_gain",
        "type": "gain_medium",
        "name": "Gain Medium (HE_NE)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "he_ne",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_044_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_044_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_045",
    "num": "045",
    "title": "Einstein Coefficients A and B Relationship",
    "titleAr": "معاملات آينشتاين (A و B) وعلاقتها بإشعاع الجسم الأسود",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Fundamental micro-reversibility relating spontaneous and stimulated emission",
    "objective": "Verify Einstein relations B12 = B21 and A21/B21 = 8*π*h*ν^3 / c^3.",
    "theory": "Equating transition rates in thermal photon bath proves stimulated emission is mandatory for Planck's law.",
    "equations": [
      {
        "latex": "A_{21} = \\frac{8\\pi h \\nu^3}{c^3} B_{21}",
        "label": "Einstein Relation",
        "desc": "Ratio of spontaneous to stimulated rate"
      }
    ],
    "defaultParams": {
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_045_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_045_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_045_gain",
        "type": "gain_medium",
        "name": "Gain Medium (YB_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "yb_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_045_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_045_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_046",
    "num": "046",
    "title": "Three-Level Laser System (Ruby Laser Model)",
    "titleAr": "منظومة الليزر ثلاثية المستويات (نموذج ليزر الياقوت)",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "High pump threshold required to invert ground state terminal level",
    "objective": "Explain why 3-level lasers require >50% ground state excitation to achieve gain.",
    "theory": "Lower laser level is the ground state; inversion requires exciting more than half of all atoms (N2 > N_total/2).",
    "equations": [
      {
        "latex": "N_2 > \\frac{N_{total}}{2}",
        "label": "3-Level Inversion Threshold",
        "desc": "Requires excitation of >50% atoms"
      }
    ],
    "defaultParams": {
      "totalAtoms": 16000000000000000000,
      "pumpPower": 800,
      "lifetime": 3
    },
    "quiz": [],
    "components": [
      {
        "id": "e46_pump",
        "type": "white_light",
        "name": "Flashlamp Pump Source",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "lampColor": "white",
        "power": 15,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "e46_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "e46_gain",
        "type": "gain_medium",
        "name": "Gain Medium (RUBY)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ruby",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "e46_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "e46_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_047",
    "num": "047",
    "title": "Four-Level Laser System (Nd:YAG Model)",
    "titleAr": "منظومة الليزر رباعية المستويات (نموذج Nd:YAG)",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Advanced",
    "time": "35 min",
    "phenomenon": "Low threshold operation with rapidly depleted lower laser level",
    "objective": "Compare efficiency and low threshold of 4-level laser compared to 3-level systems.",
    "theory": "Lower laser level depopulates rapidly (τ10 << τ21), keeping N1 ≈ 0 so any N2 > 0 produces gain.",
    "equations": [
      {
        "latex": "\\Delta N \\approx N_2, \\quad P_{th} \\ll P_{th,3-level}",
        "label": "4-Level Low Threshold",
        "desc": "Inversion condition for 4-level system"
      }
    ],
    "defaultParams": {
      "pumpPower": 250,
      "cavityLoss": 0.05,
      "outputCouplerT": 0.1
    },
    "quiz": [],
    "components": [
      {
        "id": "e47_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 455,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e47_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "e47_gain",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "e47_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "e47_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_048",
    "num": "048",
    "title": "Optical Pumping & Efficiency Optimization",
    "titleAr": "الضخ الضوئي وتحسين كفاءة التحويل الطاقي",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Spectral and spatial overlap matching between pump and laser medium",
    "objective": "Measure laser slope efficiency η_slope = dP_out / dP_pump.",
    "theory": "P_out = η_slope * (P_pump - P_th); diode matching minimizes thermal quantum defect.",
    "equations": [
      {
        "latex": "P_{out} = \\eta_{slope} (P_{pump} - P_{th})",
        "label": "Slope Efficiency",
        "desc": "Linear output power above threshold"
      }
    ],
    "defaultParams": {
      "pumpPower": 2,
      "thresholdPower": 0.4,
      "slopeEfficiency": 0.48
    },
    "quiz": [],
    "components": [
      {
        "id": "e48_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 455,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e48_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "e48_gain",
        "type": "gain_medium",
        "name": "Gain Medium (YB_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "yb_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "e48_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "e48_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_049",
    "num": "049",
    "title": "Laser Threshold Condition & Round-Trip Gain",
    "titleAr": "شرط عتبة الليزر وتوازن التكبير مع الخسائر في الدورة الكاملة",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Self-sustaining cavity oscillation when roundtrip gain equals roundtrip loss",
    "objective": "Verify threshold equation 2*γ_th*L = 2*αs*L + ln(1/(R1*R2)).",
    "theory": "At threshold, roundtrip optical gain exactly balances cavity mirror and internal scattering losses.",
    "equations": [
      {
        "latex": "\\gamma_{th} = \\alpha_s + \\frac{1}{2L} \\ln\\left(\\frac{1}{R_1 R_2}\\right)",
        "label": "Threshold Gain",
        "desc": "Gain required to balance losses"
      }
    ],
    "defaultParams": {
      "cavityLength": 20,
      "r1": 0.999,
      "r2": 0.92,
      "internalLossAlpha": 0.005
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_049_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_049_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_049_gain",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_049_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_049_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_050",
    "num": "050",
    "title": "Optical Resonator Stability & g-Parameters",
    "titleAr": "استقرار المرنان البصري ومخطط معاملات الاستقرار (g-Parameters)",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Ray confinement inside curved mirror resonators obeying 0 <= g1*g2 <= 1",
    "objective": "Map stability diagram g1*g2 vs length L and observe beam escape at stability limits.",
    "theory": "Resonator is stable against ray divergence if g-parameters satisfy 0 <= g1*g2 <= 1.",
    "equations": [
      {
        "latex": "0 \\le g_1 g_2 \\le 1, \\quad g_1 = 1 - \\frac{L}{R_1}, \\quad g_2 = 1 - \\frac{L}{R_2}",
        "label": "Stability Criterion",
        "desc": "Resonator stability condition"
      }
    ],
    "defaultParams": {
      "cavityLengthL": 300,
      "radiusR1": 500,
      "radiusR2": 500
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_050_pump",
        "type": "white_light",
        "name": "Flashlamp Pump Source",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "lampColor": "white",
        "power": 15,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "exp_050_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_050_gain",
        "type": "gain_medium",
        "name": "Gain Medium (HE_NE)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "he_ne",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_050_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_050_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_051",
    "num": "051",
    "title": "Gaussian Beam Propagation & Rayleigh Range",
    "titleAr": "انتشار الحزم الغاوسية ومدى ريليه (Rayleigh Range)",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Diffraction-governed transverse profile expansion w(z) along propagation axis",
    "objective": "Measure beam radius w(z), determine beam waist w0, and calculate Rayleigh range zR.",
    "theory": "Gaussian beam radius expands hyperbolically: w(z) = w0 * sqrt(1 + (z/zR)^2) where zR = π*w0^2 / λ.",
    "equations": [
      {
        "latex": "w(z) = w_0 \\sqrt{1 + \\left(\\frac{z}{z_R}\\right)^2}, \\quad z_R = \\frac{\\pi w_0^2}{\\lambda}",
        "label": "Gaussian Beam Radius",
        "desc": "Beam radius vs propagation distance"
      }
    ],
    "defaultParams": {
      "waistW0": 0.25,
      "wavelength": 632.8,
      "zPos": 500
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_051_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_051_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_051_gain",
        "type": "gain_medium",
        "name": "Gain Medium (YB_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "yb_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_051_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_051_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_052",
    "num": "052",
    "title": "Beam Divergence & M^2 Beam Quality Factor",
    "titleAr": "انفراج الحزمة ومعامل جودة الحزمة الليزرية (M² Factor)",
    "category": "laser_physics",
    "level": "undergraduate",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Far-field divergence half-angle θ = M^2 * λ / (π*w0) measuring focusability",
    "objective": "Perform caustic waist measurements and extract M^2 factor (M^2 = 1.0 for ideal beam).",
    "theory": "Real laser beams diverge faster than diffraction limit by factor M^2: θ = M^2 * λ / (π*w0).",
    "equations": [
      {
        "latex": "M^2 = \\frac{\\pi w_0 \\theta_{div}}{\\lambda} \\ge 1.0",
        "label": "M^2 Quality Factor",
        "desc": "Deviation from ideal TEM00 mode"
      }
    ],
    "defaultParams": {
      "m2Factor": 1.15,
      "waistW0": 0.2,
      "wavelength": 632.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_052_pump",
        "type": "white_light",
        "name": "Flashlamp Pump Source",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "lampColor": "white",
        "power": 15,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "exp_052_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_052_gain",
        "type": "gain_medium",
        "name": "Gain Medium (ER_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "er_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_052_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_052_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_053",
    "num": "053",
    "title": "Transverse Resonator Modes (TEM00, TEM01, TEM10, TEM11)",
    "titleAr": "الأنماط المستعرضة للمرنان الليزري (TEM الأنماط المكانية)",
    "category": "laser_physics",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Hermite-Gaussian intensity distributions in rectangular cavity geometry",
    "objective": "Selectively suppress TEM00 and excite higher-order Hermite-Gaussian modes TEM_mn.",
    "theory": "Hermite-Gaussian modes TEM_mn solve the paraxial wave equation with polynomial node lines.",
    "equations": [
      {
        "latex": "I_{mn}(x,y) \\propto |H_m(\\sqrt{2}x/w) H_n(\\sqrt{2}y/w)|^2 e^{-2(x^2+y^2)/w^2}",
        "label": "Hermite-Gaussian Mode",
        "desc": "Intensity distribution of mode (m,n)"
      }
    ],
    "defaultParams": {
      "modeM": 0,
      "modeN": 0,
      "beamRadius": 1
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_053_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_053_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_053_gain",
        "type": "gain_medium",
        "name": "Gain Medium (TI_SAPPHIRE)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ti_sapphire",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_053_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_053_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_054",
    "num": "054",
    "title": "Q-Switching & Giant Pulse Generation",
    "titleAr": "تبديل معامل الجودة (Q-Switching) وتوليد النبضات الليزرية العملاقة",
    "category": "laser_physics",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Rapid cavity Q transition producing nanosecond pulses with megawatt peak power",
    "objective": "Model pulse build-up time, pulse width FWHM, and peak output power.",
    "theory": "Inverting population under high loss then rapidly switching Q dumps stored energy into a giant pulse.",
    "equations": [
      {
        "latex": "P_{peak} \\approx \\frac{\\Delta N \\cdot h\\nu}{2 \\tau_c} \\ln(1/R)",
        "label": "Q-Switch Peak Power",
        "desc": "Extracted pulse peak power"
      }
    ],
    "defaultParams": {
      "storedEnergy": 50,
      "pulseDuration": 10,
      "repRate": 20
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_054_pump",
        "type": "white_light",
        "name": "Flashlamp Pump Source",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "lampColor": "white",
        "power": 15,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "exp_054_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_054_gain",
        "type": "gain_medium",
        "name": "Gain Medium (RUBY)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ruby",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_054_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_054_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_055",
    "num": "055",
    "title": "Mode Locking & Ultrafast Femtosecond Pulses",
    "titleAr": "قفل الأنماط (Mode Locking) وتوليد نبضات الفيمتوثانية",
    "category": "laser_physics",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "Phase locking of thousands of longitudinal modes creating periodic femtosecond pulses",
    "objective": "Simulate transform limit Δt * Δν >= 0.441 and measure pulse duration via autocorrelation.",
    "theory": "Locking phases of N cavity modes produces constructive pulses of duration Δt ≈ 1/(N*Δν) every T = 2L/c.",
    "equations": [
      {
        "latex": "\\Delta t \\cdot \\Delta \\nu \\ge 0.441",
        "label": "Time-Bandwidth Product",
        "desc": "Fourier limit for sech^2 pulses"
      }
    ],
    "defaultParams": {
      "pulseDurationFs": 100,
      "cavityLengthM": 1.875,
      "bandwidthNm": 15
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_055_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_055_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_055_gain",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_055_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_055_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_056",
    "num": "056",
    "title": "Nd:YAG Laser Operation (1064 nm / 532 nm)",
    "titleAr": "تشغيل ليزر Nd:YAG وإنتاج حزمة 1064 و 532 نانومتر",
    "category": "advanced_laser",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Four-level crystal gain with intracavity second harmonic generation",
    "objective": "Demonstrate 1064 nm fundamental emission and frequency conversion to green 532 nm.",
    "theory": "Nd^3+ ions in YAG lattice emit at 1064 nm. Placing KTP crystal inside resonator doubles frequency to 532 nm.",
    "equations": [
      {
        "latex": "\\lambda_{SHG} = \\frac{\\lambda_0}{2} = 532 \\text{ nm}",
        "label": "SHG Wavelength",
        "desc": "Frequency doubled green emission"
      }
    ],
    "defaultParams": {
      "pumpPower": 1500,
      "greenPower": 350
    },
    "quiz": [],
    "components": [
      {
        "id": "e56_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 455,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e56_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "e56_gain",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "e56_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "e56_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_057",
    "num": "057",
    "title": "He-Ne Laser Construction & Gas Discharge Physics",
    "titleAr": "بناء ليزر الهيليوم-نيون وفيزياء التفريغ الغازي",
    "category": "advanced_laser",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Resonant collisional excitation transfer from Helium 2s metastable to Neon 3s levels",
    "objective": "Investigate gas discharge V-I curve and resonant energy transfer producing 632.8 nm lasing.",
    "theory": "Electrons excite He metastables, which transfer energy by resonant collision to Ne upper laser level.",
    "equations": [
      {
        "latex": "\\text{He}^*(2^1S_0) + \\text{Ne} \\to \\text{He} + \\text{Ne}^*(3s_2)",
        "label": "Resonant Collisional Transfer",
        "desc": "Pumping neon upper laser state"
      }
    ],
    "defaultParams": {
      "dischargeCurrent": 5.5,
      "tubePressure": 2.5
    },
    "quiz": [],
    "components": [
      {
        "id": "e57_pump",
        "type": "white_light",
        "name": "HV Discharge Pump",
        "position": {
          "x": 430,
          "y": 125
        },
        "rotation": 90,
        "lampColor": "blue",
        "power": 8,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e57_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "e57_gain",
        "type": "gain_medium",
        "name": "Gain Medium (HE_NE)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "he_ne",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": true
      },
      {
        "id": "e57_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "e57_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_058",
    "num": "058",
    "title": "CO2 Laser Molecular Vibrational Transitions (10.6 µm)",
    "titleAr": "انتقالات المستويات الاهتزازية الجزيئية في ليزر CO2 (10.6 ميكرون)",
    "category": "advanced_laser",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Vibrational-rotational transitions between asymmetric and symmetric stretch levels",
    "objective": "Analyze molecular energy diagram of CO2 laser and role of N2 pumping and He cooling.",
    "theory": "Vibrational excitation transfers from N2 to CO2(001) mode, lasing at 10.6 µm as molecules drop to (100).",
    "equations": [
      {
        "latex": "h\\nu = E(00^0 1) - E(10^0 0) \\implies \\lambda \\approx 10.6 \\; \\mu\\text{m}",
        "label": "CO2 Transition Energy",
        "desc": "Mid-IR vibrational transition"
      }
    ],
    "defaultParams": {
      "gasFlowRate": 10,
      "rfPower": 150
    },
    "quiz": [],
    "components": [
      {
        "id": "e58_pump",
        "type": "white_light",
        "name": "HV Discharge Pump",
        "position": {
          "x": 430,
          "y": 125
        },
        "rotation": 90,
        "lampColor": "blue",
        "power": 8,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e58_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "e58_gain",
        "type": "gain_medium",
        "name": "Gain Medium (CO2)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "co2",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": true
      },
      {
        "id": "e58_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "e58_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_059",
    "num": "059",
    "title": "Excimer Laser Operation (UV 193/248 nm)",
    "titleAr": "تشغيل ليزر الإكسيمر فوق البنفسجي (ArF 193nm / KrF 248nm)",
    "category": "advanced_laser",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Bound excited dimer state decaying to unbound repulsive ground state",
    "objective": "Examine dimer formation dynamics (ArF*, KrF*) and high-photon-energy UV ablation.",
    "theory": "Noble gas-halide excimers exist only in excited state; ground state is repulsive, creating automatic population inversion.",
    "equations": [
      {
        "latex": "\\text{Ar}^* + \\text{F}_2 \\to \\text{ArF}^* + \\text{F} \\to \\text{Ar} + \\text{F} + h\\nu(193\\text{ nm})",
        "label": "Excimer Dissociation",
        "desc": "Dimer decay into unbound ground atoms"
      }
    ],
    "defaultParams": {
      "pulseEnergyMj": 200,
      "repRateHz": 50
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_059_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_059_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_059_gain",
        "type": "gain_medium",
        "name": "Gain Medium (TI_SAPPHIRE)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ti_sapphire",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_059_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_059_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_060",
    "num": "060",
    "title": "Semiconductor Laser Diode Characteristics (P-I & V-I)",
    "titleAr": "خصائص دايود الليزر شبه الموصل (منحنيات P-I و V-I)",
    "category": "advanced_laser",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Carrier injection, non-radiative recombination, and threshold knee transition",
    "objective": "Plot optical power vs drive current (P-I curve), evaluate threshold current Ith, and observe temperature effects.",
    "theory": "Below Ith, spontaneous emission dominates; above Ith, stimulated emission rapidly scales coherent output.",
    "equations": [
      {
        "latex": "I_{th}(T) = I_0 \\exp(T / T_0)",
        "label": "Threshold Temperature Shift",
        "desc": "Temperature dependence of threshold current"
      }
    ],
    "defaultParams": {
      "driveCurrent": 45,
      "tempC": 25,
      "iThreshold": 22
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_060_pump",
        "type": "white_light",
        "name": "Flashlamp Pump Source",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "lampColor": "white",
        "power": 15,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "exp_060_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_060_gain",
        "type": "gain_medium",
        "name": "Gain Medium (RUBY)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ruby",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_060_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_060_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_061",
    "num": "061",
    "title": "Fiber Laser Architecture & Cladding Pumping",
    "titleAr": "بنية ليزر الألياف والضخ عبر الغلاف (Cladding Pumping)",
    "category": "advanced_laser",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Double-clad optical fiber absorbing multimode diode pump into single-mode doped core",
    "objective": "Evaluate cladding pump absorption, core conversion efficiency, and single-mode beam quality.",
    "theory": "Pump light guides through inner cladding and gets absorbed by doped core, generating high power with diffraction-limited M^2 ≈ 1.",
    "equations": [
      {
        "latex": "\\frac{dP_p}{dz} = -\\alpha_p \\frac{A_{core}}{A_{clad}} P_p",
        "label": "Cladding Pump Absorption",
        "desc": "Pump absorption scaled by core/cladding area ratio"
      }
    ],
    "defaultParams": {
      "pumpPowerW": 20,
      "fiberLengthM": 15
    },
    "quiz": [],
    "components": [
      {
        "id": "e61_pump",
        "type": "laser",
        "name": "Pump Diode (980 nm)",
        "position": {
          "x": 105,
          "y": 270
        },
        "rotation": 0,
        "wavelength": 455,
        "power": 12,
        "beamWidth": 12,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e61_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 205,
          "y": 270
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 95,
        "diameter": 72,
        "refractiveIndex": 1.52
      },
      {
        "id": "e61_fib",
        "type": "fiber",
        "name": "Flexible Optical Fiber",
        "position": {
          "x": 448,
          "y": 270
        },
        "rotation": 0,
        "coreIndex": 1.52,
        "claddingIndex": 1.44,
        "coreDiameter": 24,
        "claddingDiameter": 40,
        "points": [
          {
            "x": 265,
            "y": 270
          },
          {
            "x": 380,
            "y": 170
          },
          {
            "x": 500,
            "y": 370
          },
          {
            "x": 630,
            "y": 270
          }
        ]
      },
      {
        "id": "e61_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 735,
          "y": 270
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_062",
    "num": "062",
    "title": "Ti:Sapphire Ultrafast Laser & Kerr-Lens Mode Locking",
    "titleAr": "ليزر التيتانيوم-ياقوت فائق السرعة وقفل الأنماط بعدسة كير (KLM)",
    "category": "advanced_laser",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "Nonlinear self-focusing (Kerr lens) acting as fast artificial saturable absorber",
    "objective": "Demonstrate KLM self-starting, broadband emission (700-900 nm), and sub-20 fs pulse formation.",
    "theory": "High intensity centers of pulses experience stronger Kerr focusing n = n0 + n2*I, favoring pulsed over CW operation.",
    "equations": [
      {
        "latex": "f_{Kerr} \\approx \\frac{w^4}{4 n_2 I L_{crystal}}",
        "label": "Kerr Focal Length",
        "desc": "Intensity-dependent nonlinear focusing lens"
      }
    ],
    "defaultParams": {
      "pumpPowerW": 5,
      "pulseWidthFs": 25
    },
    "quiz": [],
    "components": [
      {
        "id": "e62_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "e62_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "e62_gain",
        "type": "gain_medium",
        "name": "Gain Medium (TI_SAPPHIRE)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ti_sapphire",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "e62_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "e62_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_063",
    "num": "063",
    "title": "Free Electron Laser (FEL) Principle & Undulator Physics",
    "titleAr": "مبدأ ليزر الإلكترون الحر (FEL) وفيزياء المذبذب المغناطيسي (Undulator)",
    "category": "advanced_laser",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "Relativistic electron beam micro-bunching and synchrotron radiation emission",
    "objective": "Calculate resonance wavelength λr = λu/(2γ^2) * (1 + K^2/2) as electron energy γ and K vary.",
    "theory": "Relativistic electrons undulating in periodic magnetic field emit Doppler-boosted coherent radiation.",
    "equations": [
      {
        "latex": "\\lambda_r = \\frac{\\lambda_u}{2\\gamma^2}\\left(1 + \\frac{K^2}{2}\\right)",
        "label": "FEL Resonance Wavelength",
        "desc": "Governing equation for FEL emission"
      }
    ],
    "defaultParams": {
      "electronEnergyMev": 50,
      "undulatorPeriodMm": 25,
      "magneticFieldTesla": 0.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_063_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_063_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_063_gain",
        "type": "gain_medium",
        "name": "Gain Medium (YB_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "yb_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_063_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_063_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_064",
    "num": "064",
    "title": "Femtosecond Pulse Generation & Dispersion Compensation",
    "titleAr": "توليد نبضات الفيمتوثانية والتعويض عن التشتت اللوني (GDD)",
    "category": "advanced_laser",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Group velocity dispersion (GVD) pulse broadening and prism/chirped-mirror recompression",
    "objective": "Compensate positive material dispersion using negative geometric group delay dispersion (GDD < 0).",
    "theory": "Passing through optics introduces positive chirp (red travels faster than blue). Prism pairs introduce negative dispersion to recompress pulses.",
    "equations": [
      {
        "latex": "\\tau_{out} = \\tau_{in} \\sqrt{1 + \\left(\\frac{4 \\ln 2 \\cdot \\text{GDD}}{\\tau_{in}^2}\\right)^2}",
        "label": "Dispersive Pulse Broadening",
        "desc": "Broadening governed by group delay dispersion"
      }
    ],
    "defaultParams": {
      "gddFs2": -500,
      "initialPulseFs": 30
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_064_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 140,
          "y": 285
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 12,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_064_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 395,
          "y": 280
        },
        "rotation": 14,
        "prismType": "triangular",
        "size": 140,
        "refractiveIndex": 1.64
      },
      {
        "id": "exp_064_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 685,
          "y": 330
        },
        "rotation": 90,
        "width": 230
      }
    ]
  },
  {
    "id": "exp_065",
    "num": "065",
    "title": "Chirped Pulse Amplification (CPA)",
    "titleAr": "تضخيم النبضات المزقزقة (Chirped Pulse Amplification - CPA)",
    "category": "advanced_laser",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "Temporal stretching, safe amplification, and recompression avoiding crystal optical damage",
    "objective": "Demonstrate CPA stages (Nobel Prize 2018): 100 fs -> stretch to 300 ps -> amplify -> recompress to 100 fs.",
    "theory": "Stretching lowers peak intensity by 10^4, allowing amplification to petawatt regime without destroying optical components.",
    "equations": [
      {
        "latex": "I_{peak,stretched} = I_{peak,seed} \\cdot \\frac{\\tau_{seed}}{\\tau_{stretched}} \\ll I_{damage}",
        "label": "CPA Safety Condition",
        "desc": "Peak intensity suppression during amplification"
      }
    ],
    "defaultParams": {
      "stretchRatio": 3000,
      "amplifiedEnergyJ": 1
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_065_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_065_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_065_gain",
        "type": "gain_medium",
        "name": "Gain Medium (TI_SAPPHIRE)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "ti_sapphire",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_065_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_065_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_066",
    "num": "066",
    "title": "Second Harmonic Generation (SHG) & Phase Matching",
    "titleAr": "توليد التوافقية الثانية (SHG) ومطابقة الطور (Phase Matching)",
    "category": "nonlinear",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Second-order nonlinear polarization P^(2) = 2*ε0*d_eff*E^2 and birefringence phase matching",
    "objective": "Measure green output intensity vs phase matching angle θ, verifying sinc^2(Δk*L/2).",
    "theory": "Frequency doubling efficiency depends on wavevector mismatch Δk = k(2ω) - 2k(ω) = 0.",
    "equations": [
      {
        "latex": "I(2\\omega) \\propto I^2(\\omega) d_{eff}^2 L^2 \\text{sinc}^2\\left(\\frac{\\Delta k L}{2}\\right)",
        "label": "SHG Conversion Efficiency",
        "desc": "Quadratic dependence and sinc^2 phase tuning"
      }
    ],
    "defaultParams": {
      "fundamentalPower": 200,
      "crystalAngleDeg": 22.8,
      "crystalLengthMm": 5
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_066_l",
        "type": "laser",
        "name": "Pump Laser",
        "position": {
          "x": 120,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 650,
        "power": 15,
        "beamWidth": 14,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_066_f1",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 285,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 145,
        "diameter": 92,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_066_nl",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 140,
        "height": 50,
        "gainCoefficient": 1.55,
        "pumpActive": false
      },
      {
        "id": "exp_066_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 605,
          "y": 280
        },
        "rotation": 10,
        "prismType": "triangular",
        "size": 100,
        "refractiveIndex": 1.6
      },
      {
        "id": "exp_066_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 740,
          "y": 325
        },
        "rotation": 90,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_067",
    "num": "067",
    "title": "Third Harmonic Generation (THG 1064 -> 355 nm)",
    "titleAr": "توليد التوافقية الثالثة (THG 1064nm إلى 355nm الأشعة فوق البنفسجية)",
    "category": "nonlinear",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Cascaded second-harmonic (1064 -> 532 nm) followed by sum-frequency generation (1064 + 532 -> 355 nm)",
    "objective": "Optimize cascaded crystal orientations to generate coherent 355 nm UV beam.",
    "theory": "Direct χ^(3) THG is weak; high efficiency is achieved by cascading SHG with SFG (ω + 2ω = 3ω).",
    "equations": [
      {
        "latex": "\\omega_3 = \\omega + 2\\omega = 3\\omega \\implies \\lambda_3 = 354.7 \\text{ nm}",
        "label": "THG Sum Frequency",
        "desc": "Sum of fundamental and second harmonic"
      }
    ],
    "defaultParams": {
      "inputPower": 500,
      "thgAngleDeg": 11.2
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_067_l",
        "type": "laser",
        "name": "Pump Laser",
        "position": {
          "x": 120,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 650,
        "power": 15,
        "beamWidth": 14,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_067_f1",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 285,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 145,
        "diameter": 92,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_067_nl",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 140,
        "height": 50,
        "gainCoefficient": 1.55,
        "pumpActive": false
      },
      {
        "id": "exp_067_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 605,
          "y": 280
        },
        "rotation": 10,
        "prismType": "triangular",
        "size": 100,
        "refractiveIndex": 1.6
      },
      {
        "id": "exp_067_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 740,
          "y": 325
        },
        "rotation": 90,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_068",
    "num": "068",
    "title": "Sum Frequency Generation (SFG)",
    "titleAr": "توليد التردد الجمعي (Sum Frequency Generation - SFG)",
    "category": "nonlinear",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Parametric up-conversion mixing two input frequencies ω3 = ω1 + ω2",
    "objective": "Demonstrate photon energy conservation h*ω3 = h*ω1 + h*ω2 and momentum conservation k3 = k1 + k2.",
    "theory": "Two laser beams mix in non-centrosymmetric crystal to create up-converted frequency ω3 = ω1 + ω2.",
    "equations": [
      {
        "latex": "\\frac{1}{\\lambda_3} = \\frac{1}{\\lambda_1} + \\frac{1}{\\lambda_2}",
        "label": "SFG Wavelength",
        "desc": "Photon energy conservation"
      }
    ],
    "defaultParams": {
      "lambda1": 1064,
      "lambda2": 1550
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_068_l",
        "type": "laser",
        "name": "Pump Laser",
        "position": {
          "x": 120,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 650,
        "power": 15,
        "beamWidth": 14,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_068_f1",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 285,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 145,
        "diameter": 92,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_068_nl",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 140,
        "height": 50,
        "gainCoefficient": 1.55,
        "pumpActive": false
      },
      {
        "id": "exp_068_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 605,
          "y": 280
        },
        "rotation": 10,
        "prismType": "triangular",
        "size": 100,
        "refractiveIndex": 1.6
      },
      {
        "id": "exp_068_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 740,
          "y": 325
        },
        "rotation": 90,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_069",
    "num": "069",
    "title": "Difference Frequency Generation (DFG & Mid-IR)",
    "titleAr": "توليد التردد الطرحي (DFG) وتوليد أشعة تحت حمراء متوسطة",
    "category": "nonlinear",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Parametric down-conversion generating difference frequency ω3 = ω1 - ω2 in mid-IR",
    "objective": "Generate widely tunable coherent mid-IR radiation (3-12 µm) for molecular fingerprint sensing.",
    "theory": "Photons at ω1 down-convert into ω2 and difference photon ω3 = ω1 - ω2.",
    "equations": [
      {
        "latex": "\\omega_3 = \\omega_1 - \\omega_2",
        "label": "DFG Frequency",
        "desc": "Difference frequency emission"
      }
    ],
    "defaultParams": {
      "lambda1": 800,
      "lambda2": 1064
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_069_l",
        "type": "laser",
        "name": "Pump Laser",
        "position": {
          "x": 120,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 650,
        "power": 15,
        "beamWidth": 14,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_069_f1",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 285,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 145,
        "diameter": 92,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_069_nl",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 140,
        "height": 50,
        "gainCoefficient": 1.55,
        "pumpActive": false
      },
      {
        "id": "exp_069_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 605,
          "y": 280
        },
        "rotation": 10,
        "prismType": "triangular",
        "size": 100,
        "refractiveIndex": 1.6
      },
      {
        "id": "exp_069_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 740,
          "y": 325
        },
        "rotation": 90,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_070",
    "num": "070",
    "title": "Optical Parametric Amplification (OPA)",
    "titleAr": "التضخيم البارامتري الضوئي (OPA)",
    "category": "nonlinear",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "High-power pump transferring energy to weak signal and generating idler wave",
    "objective": "Model parametric gain of signal and idler as a function of pump intensity and phase matching.",
    "theory": "Pump photon ω_p splits into signal photon ω_s and idler photon ω_i, amplifying seed exponentially.",
    "equations": [
      {
        "latex": "G_s = 1 + \\frac{\\Gamma^2}{g^2} \\sinh^2(g L), \\quad \\omega_p = \\omega_s + \\omega_i",
        "label": "OPA Parametric Gain",
        "desc": "Signal amplification factor"
      }
    ],
    "defaultParams": {
      "pumpIntensityGw": 2,
      "signalWavelengthNm": 1300
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_070_l",
        "type": "laser",
        "name": "Pump Laser",
        "position": {
          "x": 120,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 650,
        "power": 15,
        "beamWidth": 14,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_070_f1",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 285,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 145,
        "diameter": 92,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_070_nl",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 140,
        "height": 50,
        "gainCoefficient": 1.55,
        "pumpActive": false
      },
      {
        "id": "exp_070_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 605,
          "y": 280
        },
        "rotation": 10,
        "prismType": "triangular",
        "size": 100,
        "refractiveIndex": 1.6
      },
      {
        "id": "exp_070_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 740,
          "y": 325
        },
        "rotation": 90,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_071",
    "num": "071",
    "title": "Optical Parametric Oscillation (OPO)",
    "titleAr": "المتذبذب البارامتري الضوئي (OPO)",
    "category": "nonlinear",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "Tunable coherent source generated inside cavity resonant for signal or idler",
    "objective": "Map OPO wavelength tuning curves as crystal temperature and angle vary.",
    "theory": "Placing OPA crystal inside optical cavity allows oscillation to build up from parametric fluorescence.",
    "equations": [
      {
        "latex": "\\hbar \\omega_p = \\hbar \\omega_s + \\hbar \\omega_i, \\quad \\vec{k}_p = \\vec{k}_s + \\vec{k}_i",
        "label": "OPO Phase Matching",
        "desc": "Energy and momentum matching"
      }
    ],
    "defaultParams": {
      "crystalTempC": 150,
      "pumpPowerW": 3
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_071_l",
        "type": "laser",
        "name": "Pump Laser",
        "position": {
          "x": 120,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 650,
        "power": 15,
        "beamWidth": 14,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_071_f1",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 285,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 145,
        "diameter": 92,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_071_nl",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 140,
        "height": 50,
        "gainCoefficient": 1.55,
        "pumpActive": false
      },
      {
        "id": "exp_071_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 605,
          "y": 280
        },
        "rotation": 10,
        "prismType": "triangular",
        "size": 100,
        "refractiveIndex": 1.6
      },
      {
        "id": "exp_071_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 740,
          "y": 325
        },
        "rotation": 90,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_072",
    "num": "072",
    "title": "Optical Kerr Effect & Intensity-Dependent Index",
    "titleAr": "تأثير كير الضوئي ومعامل الانكسار المعتمد على الشدة",
    "category": "nonlinear",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Refractive index modification n = n0 + n2*I under intense electric fields",
    "objective": "Perform closed-aperture Z-scan to measure nonlinear refractive index n2.",
    "theory": "Third-order susceptibility χ^(3) changes refractive index proportionally to beam intensity: Δn = n2*I.",
    "equations": [
      {
        "latex": "n(I) = n_0 + n_2 I",
        "label": "Optical Kerr Law",
        "desc": "Intensity-dependent refractive index"
      }
    ],
    "defaultParams": {
      "n2Value": 3.2e-16,
      "laserIntensityGw": 5
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_072_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 150,
          "y": 175
        },
        "rotation": 24,
        "wavelength": 532,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_072_pr",
        "type": "protractor",
        "name": "Circular Protractor",
        "position": {
          "x": 355,
          "y": 265
        },
        "rotation": 90,
        "radius": 105
      },
      {
        "id": "exp_072_m",
        "type": "medium",
        "name": "Optical Crystal / Plate",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "width": 175,
        "height": 150,
        "refractiveIndex": 1.54,
        "absorptionCoefficient": 0
      },
      {
        "id": "exp_072_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 375
        },
        "rotation": 114,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_073",
    "num": "073",
    "title": "Self-Phase Modulation (SPM) & Spectral Broadening",
    "titleAr": "تعديل الطور الذاتي (SPM) وتوسع العرض الطيفي للنبضات",
    "category": "nonlinear",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Time-dependent nonlinear phase shift broadening pulse spectrum",
    "objective": "Observe multi-peak spectral broadening caused by maximum nonlinear phase shift Φ_NL = γ*P0*L_eff.",
    "theory": "Temporal intensity profile I(t) produces time-dependent phase φ(t) = -ω0*t - (n2*I(t)*k0*L), generating new frequencies.",
    "equations": [
      {
        "latex": "\\Delta \\omega(t) = -\\frac{\\partial \\phi}{\\partial t} = -\\frac{n_2 \\omega_0 L}{c} \\frac{\\partial I}{\\partial t}",
        "label": "SPM Frequency Shift",
        "desc": "Instantaneous frequency chirping"
      }
    ],
    "defaultParams": {
      "peakPowerKw": 10,
      "fiberLengthM": 2
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_073_l",
        "type": "laser",
        "name": "Pump Laser",
        "position": {
          "x": 120,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 650,
        "power": 15,
        "beamWidth": 14,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_073_f1",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 285,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 145,
        "diameter": 92,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_073_nl",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 140,
        "height": 50,
        "gainCoefficient": 1.55,
        "pumpActive": false
      },
      {
        "id": "exp_073_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 605,
          "y": 280
        },
        "rotation": 10,
        "prismType": "triangular",
        "size": 100,
        "refractiveIndex": 1.6
      },
      {
        "id": "exp_073_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 740,
          "y": 325
        },
        "rotation": 90,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_074",
    "num": "074",
    "title": "Four-Wave Mixing (FWM) in Photonic Fibers",
    "titleAr": "خلط الموجات الأربع (Four-Wave Mixing - FWM)",
    "category": "nonlinear",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Parametric interaction where two pump photons generate Stokes and anti-Stokes photons",
    "objective": "Observe new sideband generation at 2ω1 - ω2 and investigate phase matching in fiber.",
    "theory": "Third-order susceptibility χ^(3) couples four optical frequencies: 2*ω_pump = ω_signal + ω_idler.",
    "equations": [
      {
        "latex": "\\omega_3 + \\omega_4 = \\omega_1 + \\omega_2",
        "label": "FWM Frequency Conservation",
        "desc": "Energy conservation in four-wave mixing"
      }
    ],
    "defaultParams": {
      "pumpPowerMw": 50,
      "channelSpacingGhz": 100
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_074_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 110,
          "y": 270
        },
        "rotation": 0,
        "wavelength": 450,
        "power": 8,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_074_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 210,
          "y": 270
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 95,
        "diameter": 72,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_074_fib",
        "type": "fiber",
        "name": "Flexible Optical Fiber",
        "position": {
          "x": 453,
          "y": 273
        },
        "rotation": 0,
        "coreIndex": 1.5,
        "claddingIndex": 1.44,
        "coreDiameter": 24,
        "claddingDiameter": 40,
        "points": [
          {
            "x": 270,
            "y": 270
          },
          {
            "x": 385,
            "y": 175
          },
          {
            "x": 505,
            "y": 365
          },
          {
            "x": 635,
            "y": 275
          }
        ]
      },
      {
        "id": "exp_074_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 735,
          "y": 275
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_075",
    "num": "075",
    "title": "Self-Focusing & Optical Filamentation",
    "titleAr": "التركيز الذاتي وتكوين الخيوط الضوئية (Optical Filamentation)",
    "category": "nonlinear",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "Balance between Kerr self-focusing and plasma defocusing channeling beam over long distances",
    "objective": "Calculate critical power P_cr = 3.77*λ^2 / (8*π*n0*n2) and observe filament formation.",
    "theory": "When beam power exceeds P_cr, Kerr self-focusing collapses beam until air ionizes; plasma defocusing stabilizes a persistent filament.",
    "equations": [
      {
        "latex": "P_{cr} = \\frac{3.77 \\lambda^2}{8 \\pi n_0 n_2}",
        "label": "Critical Self-Focusing Power",
        "desc": "Threshold power for catastrophic self-focusing"
      }
    ],
    "defaultParams": {
      "pulsePowerGw": 8,
      "criticalPowerGw": 3.2
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_075_l",
        "type": "laser",
        "name": "Pump Laser",
        "position": {
          "x": 120,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 650,
        "power": 15,
        "beamWidth": 14,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_075_f1",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 285,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 145,
        "diameter": 92,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_075_nl",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 445,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 140,
        "height": 50,
        "gainCoefficient": 1.55,
        "pumpActive": false
      },
      {
        "id": "exp_075_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 605,
          "y": 280
        },
        "rotation": 10,
        "prismType": "triangular",
        "size": 100,
        "refractiveIndex": 1.6
      },
      {
        "id": "exp_075_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 740,
          "y": 325
        },
        "rotation": 90,
        "width": 95
      }
    ]
  },
  {
    "id": "exp_076",
    "num": "076",
    "title": "Absorption Spectroscopy & Beer-Lambert Law",
    "titleAr": "مطيافية الامتصاص وقانون بير-لامبرت",
    "category": "spectroscopy",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Exponential optical attenuation through absorbing molecular solute",
    "objective": "Verify absorbance A = -log10(I/I0) = ε*c*L scales linearly with concentration.",
    "theory": "Absorbing solutes reduce beam intensity exponentially dI = -α*I*dz, yielding linear absorbance vs concentration.",
    "equations": [
      {
        "latex": "A = -\\log_{10}(I / I_0) = \\epsilon \\cdot c \\cdot L",
        "label": "Beer-Lambert Law",
        "desc": "Linear absorbance scaling"
      }
    ],
    "defaultParams": {
      "concentration": 0.05,
      "pathLength": 1,
      "extinctionCoeff": 2200
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_076_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_076_g",
        "type": "grating",
        "name": "Diffraction Grating",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "gratingDensity": 600
      },
      {
        "id": "exp_076_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 260
      }
    ]
  },
  {
    "id": "exp_077",
    "num": "077",
    "title": "Atomic Emission Spectroscopy & Spectral Line Analysis",
    "titleAr": "مطيافية الانبعاث الذري وتحليل الخطوط الطيفية للعناصر",
    "category": "spectroscopy",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Discrete wavelength photon emission from electronic de-excitation",
    "objective": "Observe Rydberg formula lines for Hydrogen Balmer series and calibrate spectrometer.",
    "theory": "Atoms emit discrete spectral lines corresponding to photon energy hν = E_upper - E_lower.",
    "equations": [
      {
        "latex": "\\frac{1}{\\lambda} = R_H \\left(\\frac{1}{2^2} - \\frac{1}{n^2}\\right)",
        "label": "Balmer Formula",
        "desc": "Hydrogen visible emission lines"
      }
    ],
    "defaultParams": {
      "gasElement": "Hydrogen",
      "gratingPitchUm": 1.666
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_077_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_077_g",
        "type": "grating",
        "name": "Diffraction Grating",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "gratingDensity": 600
      },
      {
        "id": "exp_077_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 260
      }
    ]
  },
  {
    "id": "exp_078",
    "num": "078",
    "title": "Fluorescence Spectroscopy & Stokes Shift",
    "titleAr": "مطيافية الفلورة والإزاحة الطيفية لستوكس (Stokes Shift)",
    "category": "spectroscopy",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Absorption followed by rapid vibrational relaxation and red-shifted emission",
    "objective": "Measure excitation and emission spectra, determine Stokes shift Δλ_Stokes, and evaluate quantum yield.",
    "theory": "Non-radiative vibrational relaxation in excited state S1 causes fluorescence to emit at lower energy (longer wavelength).",
    "equations": [
      {
        "latex": "\\Delta E_{Stokes} = h c \\left(\\frac{1}{\\lambda_{abs}} - \\frac{1}{\\lambda_{em}}\\right)",
        "label": "Stokes Energy Shift",
        "desc": "Energy loss to vibrational lattice modes"
      }
    ],
    "defaultParams": {
      "excWavelength": 532,
      "emPeakWavelength": 568
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_078_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_078_g",
        "type": "grating",
        "name": "Diffraction Grating",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "gratingDensity": 600
      },
      {
        "id": "exp_078_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 260
      }
    ]
  },
  {
    "id": "exp_079",
    "num": "079",
    "title": "Raman Spectroscopy & Vibrational Fingerprinting",
    "titleAr": "مطيافية رامان والتحليل الاهتزازي الجزيئي (Stokes & Anti-Stokes)",
    "category": "spectroscopy",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Inelastic scattering by molecular vibrational phonon modes",
    "objective": "Identify Stokes and anti-Stokes Raman shift peaks and evaluate Boltzmann temperature ratio.",
    "theory": "Photons scatter inelastically, gaining or losing vibrational quanta h*ν_vib, creating unique molecular fingerprints.",
    "equations": [
      {
        "latex": "\\frac{I_{anti-Stokes}}{I_{Stokes}} = \\left(\\frac{\\nu_0 + \\nu_v}{\\nu_0 - \\nu_v}\\right)^4 \\exp\\left(-\\frac{h\\nu_v}{k_B T}\\right)",
        "label": "Raman Intensity Ratio",
        "desc": "Anti-Stokes to Stokes ratio depends on temperature"
      }
    ],
    "defaultParams": {
      "laserWavelength": 785,
      "sample": "CCl4"
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_079_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_079_g",
        "type": "grating",
        "name": "Diffraction Grating",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "gratingDensity": 600
      },
      {
        "id": "exp_079_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 260
      }
    ]
  },
  {
    "id": "exp_080",
    "num": "080",
    "title": "Fourier Transform Infrared Spectroscopy (FTIR)",
    "titleAr": "مطيافية تحويل فورييه للأشعة تحت الحمراء (FTIR)",
    "category": "spectroscopy",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Interferogram acquisition via scanning Michelson interferometer and FFT transformation",
    "objective": "Record raw temporal interferogram I(x) and compute transmission spectrum T(ν) via Fast Fourier Transform.",
    "theory": "Interferogram is Fourier transform of input spectrum; numerical FFT reveals molecular vibrational absorption bands.",
    "equations": [
      {
        "latex": "B(\\tilde{\\nu}) = \\int_{-\\infty}^{+\\infty} I(x) \\cos(2\\pi \\tilde{\\nu} x) dx",
        "label": "FTIR Transform",
        "desc": "Spectral recovery from spatial interferogram"
      }
    ],
    "defaultParams": {
      "resolutionCm1": 4,
      "scans": 16
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_080_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_080_g",
        "type": "grating",
        "name": "Diffraction Grating",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "gratingDensity": 600
      },
      {
        "id": "exp_080_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 260
      }
    ]
  },
  {
    "id": "exp_081",
    "num": "081",
    "title": "UV-Visible Spectroscopy & Optical Bandgap (Tauc Plot)",
    "titleAr": "مطيافية الأشعة المرئية وفوق البنفسجية وتحديد فجوة الطاقة (Tauc Plot)",
    "category": "spectroscopy",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Interband electronic transition absorption edge in semiconductors",
    "objective": "Determine direct and indirect optical bandgap Eg by linear extrapolation of (α*hν)^2 vs hν (Tauc plot).",
    "theory": "Near absorption threshold, absorption coefficient scales as (α*hν)^(1/n) = A*(hν - Eg) where n=1/2 for direct transitions.",
    "equations": [
      {
        "latex": "(\\alpha h\\nu)^2 = A (h\\nu - E_g)",
        "label": "Tauc Direct Bandgap Relation",
        "desc": "Linear plot extrapolation gives bandgap Eg"
      }
    ],
    "defaultParams": {
      "trueEgEv": 3.2,
      "filmThicknessNm": 200
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_081_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_081_g",
        "type": "grating",
        "name": "Diffraction Grating",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "gratingDensity": 600
      },
      {
        "id": "exp_081_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 260
      }
    ]
  },
  {
    "id": "exp_082",
    "num": "082",
    "title": "Laser-Induced Breakdown Spectroscopy (LIBS)",
    "titleAr": "مطيافية الانبعاث البلازمي المحتث بالليزر (LIBS)",
    "category": "spectroscopy",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Micro-plasma optical breakdown emission for multi-elemental analysis",
    "objective": "Measure elemental emission lines (Al, Cu, Fe) and estimate plasma temperature from Boltzmann plot.",
    "theory": "Laser pulse vaporizes and ionizes target; emission lines during plasma cooling identify elements.",
    "equations": [
      {
        "latex": "\\ln\\left(\\frac{I_{ki} \\lambda_{ki}}{g_k A_{ki}}\\right) = -\\frac{E_k}{k_B T_e} + C",
        "label": "Boltzmann Plot",
        "desc": "Extracts plasma electronic temperature Te"
      }
    ],
    "defaultParams": {
      "pulseEnergy": 50,
      "delayTimeNs": 1200,
      "targetMaterial": "Aluminum"
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_082_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_082_g",
        "type": "grating",
        "name": "Diffraction Grating",
        "position": {
          "x": 360,
          "y": 280
        },
        "rotation": 90,
        "width": 130,
        "gratingDensity": 600
      },
      {
        "id": "exp_082_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 280
        },
        "rotation": 90,
        "width": 260
      }
    ]
  },
  {
    "id": "exp_083",
    "num": "083",
    "title": "Optical Fiber Communication & Eye Diagram",
    "titleAr": "الاتصالات بالألياف البصرية ومخطط العين (Eye Diagram)",
    "category": "spectroscopy",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "High-speed NRZ digital optical pulse transmission and chromatic dispersion impairment",
    "objective": "Analyze eye height, jitter, and bit-error rate (BER) as fiber transmission distance increases.",
    "theory": "Fiber dispersion and attenuation distort digital pulses, closing the eye diagram and increasing bit errors.",
    "equations": [
      {
        "latex": "\\text{BER} = \\frac{1}{2} \\text{erfc}\\left(\\frac{Q}{\\sqrt{2}}\\right), \\quad Q = \\frac{I_1 - I_0}{\\sigma_1 + \\sigma_0}",
        "label": "Bit Error Rate & Q-Factor",
        "desc": "Signal quality metric in optical communications"
      }
    ],
    "defaultParams": {
      "bitRateGbps": 10,
      "fiberLengthKm": 40
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_083_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 110,
          "y": 270
        },
        "rotation": 0,
        "wavelength": 450,
        "power": 8,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_083_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 210,
          "y": 270
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 95,
        "diameter": 72,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_083_fib",
        "type": "fiber",
        "name": "Flexible Optical Fiber",
        "position": {
          "x": 453,
          "y": 273
        },
        "rotation": 0,
        "coreIndex": 1.5,
        "claddingIndex": 1.44,
        "coreDiameter": 24,
        "claddingDiameter": 40,
        "points": [
          {
            "x": 270,
            "y": 270
          },
          {
            "x": 385,
            "y": 175
          },
          {
            "x": 505,
            "y": 365
          },
          {
            "x": 635,
            "y": 275
          }
        ]
      },
      {
        "id": "exp_083_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 735,
          "y": 275
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_084",
    "num": "084",
    "title": "Wavelength Division Multiplexing (WDM)",
    "titleAr": "التضمين بتقسيم الأطوال الموجية (WDM)",
    "category": "spectroscopy",
    "level": "masters",
    "difficulty": "Intermediate",
    "time": "40 min",
    "phenomenon": "Simultaneous transmission of multiple optical carriers across C-band (1530-1565 nm)",
    "objective": "Multiplex 4 to 8 wavelength channels into single fiber and measure cross-talk rejection ratio.",
    "theory": "WDM multiplies fiber data capacity by combining discrete wavelengths separated by ITU 100 GHz grid.",
    "equations": [
      {
        "latex": "\\text{Crosstalk (dB)} = 10 \\log_{10}\\left(\\frac{P_{leak}}{P_{signal}}\\right)",
        "label": "Channel Isolation",
        "desc": "Inter-channel isolation metric"
      }
    ],
    "defaultParams": {
      "channels": 4,
      "channelSpacingNm": 0.8
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_084_w",
        "type": "white_light",
        "name": "Optical Lamp",
        "position": {
          "x": 130,
          "y": 280
        },
        "rotation": 0,
        "lampColor": "white",
        "power": 10,
        "beamWidth": 12,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_084_p",
        "type": "prism",
        "name": "triangular Prism",
        "position": {
          "x": 385,
          "y": 280
        },
        "rotation": 14,
        "prismType": "triangular",
        "size": 135,
        "refractiveIndex": 1.62
      },
      {
        "id": "exp_084_s",
        "type": "screen",
        "name": "Observation Screen",
        "position": {
          "x": 680,
          "y": 330
        },
        "rotation": 90,
        "width": 230
      }
    ]
  },
  {
    "id": "exp_085",
    "num": "085",
    "title": "Fiber Bragg Grating (FBG) Strain & Temperature Sensing",
    "titleAr": "محزوز براغ في الألياف (FBG) وتحسس الإجهاد ودرجة الحرارة",
    "category": "spectroscopy",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "35 min",
    "phenomenon": "Narrowband reflection at Bragg wavelength λB = 2*neff*Λ shifting with physical strain and heat",
    "objective": "Calibrate Bragg wavelength shift ΔλB vs mechanical micro-strain (με) and temperature (°C).",
    "theory": "Periodic refractive index modulation in fiber core reflects λB = 2*neff*Λ; mechanical elongation changes Λ.",
    "equations": [
      {
        "latex": "\\frac{\\Delta \\lambda_B}{\\lambda_B} = (1 - p_e) \\epsilon + (\\alpha + \\xi) \\Delta T",
        "label": "FBG Sensor Equation",
        "desc": "Bragg wavelength shift from strain ε and temperature ΔT"
      }
    ],
    "defaultParams": {
      "lambdaB": 1550,
      "strainMicro": 500,
      "deltaTempC": 20
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_085_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 110,
          "y": 270
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 8,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_085_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 210,
          "y": 270
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 95,
        "diameter": 72,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_085_fib",
        "type": "fiber",
        "name": "Flexible Optical Fiber",
        "position": {
          "x": 453,
          "y": 273
        },
        "rotation": 0,
        "coreIndex": 1.5,
        "claddingIndex": 1.44,
        "coreDiameter": 24,
        "claddingDiameter": 40,
        "points": [
          {
            "x": 270,
            "y": 270
          },
          {
            "x": 385,
            "y": 175
          },
          {
            "x": 505,
            "y": 365
          },
          {
            "x": 635,
            "y": 275
          }
        ]
      },
      {
        "id": "exp_085_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 735,
          "y": 275
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_086",
    "num": "086",
    "title": "Laser Ablation & Fluence Threshold",
    "titleAr": "الاستئصال الليزري وعتبة الفيض الطاقي (Ablation Threshold)",
    "category": "materials",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Target mass removal when laser fluence exceeds threshold Fth",
    "objective": "Measure crater depth vs fluence F and extract ablation threshold Fth.",
    "theory": "Ablation occurs when absorbed energy density exceeds vaporization enthalpy: d = δ_eff * ln(F / Fth).",
    "equations": [
      {
        "latex": "d = \\delta_{eff} \\ln\\left(\\frac{F}{F_{th}}\\right)",
        "label": "Logarithmic Ablation Depth",
        "desc": "Crater depth per pulse"
      }
    ],
    "defaultParams": {
      "fluenceF": 4.5,
      "thresholdFth": 1.2,
      "penetrationDepth": 0.08
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_086_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 450,
        "power": 12,
        "beamWidth": 22,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_086_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 305,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 165,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_086_t",
        "type": "medium",
        "name": "Target / Tissue Sample",
        "position": {
          "x": 495,
          "y": 280
        },
        "rotation": 0,
        "width": 130,
        "height": 110,
        "refractiveIndex": 1.44,
        "absorptionCoefficient": 1.15
      },
      {
        "id": "exp_086_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_087",
    "num": "087",
    "title": "Laser-Induced Plasma Formation & Dynamics",
    "titleAr": "تكون وتمدد البلازما المحتثة بالليزر وديناميكيتها",
    "category": "materials",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Multi-photon ionization and cascade avalanche forming high-density plasma",
    "objective": "Simulate plasma expansion velocity and electron density decay Ne(t).",
    "theory": "Initial seed electrons generated by multi-photon absorption trigger avalanche ionization in intense laser fields.",
    "equations": [
      {
        "latex": "v_{plume} = \\sqrt{\\frac{5 k_B T_0}{M}}",
        "label": "Plume Expansion Velocity",
        "desc": "Adiabatic plasma expansion speed"
      }
    ],
    "defaultParams": {
      "laserFluence": 10,
      "targetAtomicMass": 27
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_087_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 12,
        "beamWidth": 22,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_087_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 305,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 165,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_087_t",
        "type": "medium",
        "name": "Target / Tissue Sample",
        "position": {
          "x": 495,
          "y": 280
        },
        "rotation": 0,
        "width": 130,
        "height": 110,
        "refractiveIndex": 1.44,
        "absorptionCoefficient": 1.15
      },
      {
        "id": "exp_087_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_088",
    "num": "088",
    "title": "Laser-Material Heating & Thermal Conduction",
    "titleAr": "التسخين الليزري للمواد ونموذج التوصيل الحراري",
    "category": "materials",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Transient temperature rise and thermal diffusion length L_th = 2*sqrt(D*t)",
    "objective": "Calculate surface temperature rise ΔT(t) and compare conduction in steel vs high-conductivity copper.",
    "theory": "Absorbed laser energy diffuses into material governed by 1D heat equation; thermal diffusion depth scales as sqrt(D*t).",
    "equations": [
      {
        "latex": "\\Delta T_{surf} = \\frac{2 I_a}{\\kappa} \\sqrt{\\frac{D t}{\\pi}}",
        "label": "Surface Temperature Rise",
        "desc": "Transient temperature under uniform laser flux"
      }
    ],
    "defaultParams": {
      "laserPowerW": 500,
      "spotDiameterMm": 2,
      "exposureTimeMs": 50
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_088_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_088_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 315,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 155,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_088_t",
        "type": "medium",
        "name": "Target Material",
        "position": {
          "x": 500,
          "y": 280
        },
        "rotation": 0,
        "width": 125,
        "height": 110,
        "refractiveIndex": 1.45,
        "absorptionCoefficient": 0.95
      },
      {
        "id": "exp_088_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_089",
    "num": "089",
    "title": "Laser Welding: Conduction vs Keyhole Mode",
    "titleAr": "اللحام بالليزر: نمط التوصيل الحراري ونمط الثقب المفتاحي (Keyhole)",
    "category": "materials",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Transition from shallow conduction weld pool to deep vapor-recoil keyhole penetration",
    "objective": "Identify threshold power density (~10^6 W/cm^2) triggering keyhole vapor cavity formation.",
    "theory": "At high intensity, surface metal boils; vapor recoil pressure opens a vapor keyhole that traps laser light via multiple reflections.",
    "equations": [
      {
        "latex": "I_{keyhole} \\ge 10^6 \\text{ W/cm}^2, \\quad \\text{Aspect Ratio} = \\frac{\\text{Depth}}{\\text{Width}} > 2",
        "label": "Keyhole Threshold",
        "desc": "Threshold power density for deep penetration"
      }
    ],
    "defaultParams": {
      "laserPowerKw": 2.5,
      "weldingSpeedMpm": 1.5
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_089_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 450,
        "power": 12,
        "beamWidth": 22,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_089_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 305,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 165,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_089_t",
        "type": "medium",
        "name": "Target / Tissue Sample",
        "position": {
          "x": 495,
          "y": 280
        },
        "rotation": 0,
        "width": 130,
        "height": 110,
        "refractiveIndex": 1.44,
        "absorptionCoefficient": 1.15
      },
      {
        "id": "exp_089_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_090",
    "num": "090",
    "title": "Laser Cutting & Assist Gas Dynamics",
    "titleAr": "القطع بالليزر وديناميكا الغاز المساعد (Kerf Width)",
    "category": "materials",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Laser melt generation and supersonic coaxial assist gas melt expulsion",
    "objective": "Analyze kerf width, cutting speed, and dross formation using O2 reactive vs N2 high-pressure inert cutting.",
    "theory": "Assist gas blows molten material out of the kerf slot; oxygen adds exothermic reaction energy while nitrogen preserves oxidation-free edges.",
    "equations": [
      {
        "latex": "v_{cut} = \\frac{P_{laser} - P_{loss}}{\\rho A_{kerf} [C_p(T_m - T_0) + L_m]}",
        "label": "Cutting Speed Equation",
        "desc": "Maximum cutting speed from energy balance"
      }
    ],
    "defaultParams": {
      "laserPowerW": 3000,
      "sheetThicknessMm": 3
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_090_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 12,
        "beamWidth": 22,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_090_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 305,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 165,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_090_t",
        "type": "medium",
        "name": "Target / Tissue Sample",
        "position": {
          "x": 495,
          "y": 280
        },
        "rotation": 0,
        "width": 130,
        "height": 110,
        "refractiveIndex": 1.44,
        "absorptionCoefficient": 1.15
      },
      {
        "id": "exp_090_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_091",
    "num": "091",
    "title": "Laser Surface Modification & Shock Peening",
    "titleAr": "المعالجة السطحية بالليزر والصدم الميكانيكي (Laser Shock Peening)",
    "category": "materials",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "High-pressure plasma shockwaves (>GPa) inducing compressive residual stress",
    "objective": "Calculate plasma shock pressure P = 0.01*sqrt(α/(2α+3))*sqrt(I)*sqrt(Z) and analyze fatigue resistance.",
    "theory": "Tamping water confinement traps expanding ablation plasma, generating gigapascal shockwaves that harden surface metals.",
    "equations": [
      {
        "latex": "P_{shock} = 0.01 \\sqrt{\\frac{\\alpha}{2\\alpha + 3}} \\sqrt{Z} \\sqrt{I}",
        "label": "Fabbro Shock Pressure",
        "desc": "Plasma shock pressure under water confinement"
      }
    ],
    "defaultParams": {
      "pulseEnergyJ": 5,
      "spotDiameterMm": 3
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_091_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_091_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 315,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 155,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_091_t",
        "type": "medium",
        "name": "Target Material",
        "position": {
          "x": 500,
          "y": 280
        },
        "rotation": 0,
        "width": 125,
        "height": 110,
        "refractiveIndex": 1.45,
        "absorptionCoefficient": 0.95
      },
      {
        "id": "exp_091_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_092",
    "num": "092",
    "title": "Pulsed Laser Deposition (PLD) Thin-Film Synthesis",
    "titleAr": "الترسيب بالليزر النبضي (PLD) لتخليق الأغشية الرقيقة",
    "category": "materials",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "45 min",
    "phenomenon": "Plasma plume expansion, hydrodynamic transport, and stoichiometric film condensation",
    "objective": "Simulate plasma plume forward-peaking expansion cos^p(θ) and deposited film thickness profile.",
    "theory": "Laser ablation in vacuum ejects stoichiometric plasma plumes that condense into high-quality epitaxial thin films.",
    "equations": [
      {
        "latex": "t(r) = \\frac{M}{2\\pi \\rho d_{ts}^2} \\left(1 + \\frac{r^2}{d_{ts}^2}\\right)^{-p/2}",
        "label": "PLD Film Thickness Profile",
        "desc": "Film thickness across substrate"
      }
    ],
    "defaultParams": {
      "targetDistance": 45,
      "pulses": 5000,
      "backgroundPressure": 0.05
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_092_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 450,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_092_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 315,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 155,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_092_t",
        "type": "medium",
        "name": "Target Material",
        "position": {
          "x": 500,
          "y": 280
        },
        "rotation": 0,
        "width": 125,
        "height": 110,
        "refractiveIndex": 1.45,
        "absorptionCoefficient": 0.95
      },
      {
        "id": "exp_092_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_093",
    "num": "093",
    "title": "Pulsed Laser Deposition in Liquid (PLD in Liquid / LAL)",
    "titleAr": "الترسيب بالليزر النبضي في السوائل (LAL) وتخليق الجسيمات النانوية",
    "category": "materials",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "Liquid ablation, cavitation bubble expansion/collapse, and colloidal nanoparticle synthesis",
    "objective": "Simulate cavitation bubble lifetime via Rayleigh-Plesset equation and nanoparticle size distribution.",
    "theory": "Laser pulse in liquid confines plasma, forming a cavitation bubble. Upon bubble collapse, nucleated clusters quench into stable nanoparticles.",
    "equations": [
      {
        "latex": "T_{bubble} = 1.83 R_{max} \\sqrt{\\frac{\\rho_L}{P_{stat}}}",
        "label": "Rayleigh Bubble Collapse Time",
        "desc": "Cavitation bubble oscillation period"
      }
    ],
    "defaultParams": {
      "pulseEnergyMj": 30,
      "liquidLayerMm": 5
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_093_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_093_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 315,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 155,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_093_t",
        "type": "medium",
        "name": "Target Material",
        "position": {
          "x": 500,
          "y": 280
        },
        "rotation": 0,
        "width": 125,
        "height": 110,
        "refractiveIndex": 1.45,
        "absorptionCoefficient": 0.95
      },
      {
        "id": "exp_093_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_094",
    "num": "094",
    "title": "Laser-Tissue Interaction & Optical Penetration Depth",
    "titleAr": "تفاعل الليزر مع الأنسجة الحيوية وعمق النفاذ الضوئي",
    "category": "biomedical",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Diffuse photon scattering and chromophore absorption in biological turbid media",
    "objective": "Model light distribution in tissue using diffusion theory and identify optical therapeutic window.",
    "theory": "Light penetration in biological tissue is governed by absorption μa and reduced scattering μs': δ = 1/sqrt(3*μa*(μa+μs')).",
    "equations": [
      {
        "latex": "\\delta = \\frac{1}{\\sqrt{3 \\mu_a (\\mu_a + \\mu_s')}}",
        "label": "Penetration Depth",
        "desc": "Depth where diffuse light decays to 1/e"
      }
    ],
    "defaultParams": {
      "muA": 0.1,
      "muSPrime": 10,
      "wavelength": 810
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_094_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 810,
        "power": 12,
        "beamWidth": 22,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_094_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 305,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 165,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_094_t",
        "type": "medium",
        "name": "Target / Tissue Sample",
        "position": {
          "x": 495,
          "y": 280
        },
        "rotation": 0,
        "width": 130,
        "height": 110,
        "refractiveIndex": 1.44,
        "absorptionCoefficient": 1.15
      },
      {
        "id": "exp_094_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 690,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_095",
    "num": "095",
    "title": "Er:YAG Medical Laser System (2940 nm) & Tissue Ablation",
    "titleAr": "منظومة ليزر الإربيوم–ياك (Er:YAG 2940 nm) والتطبيقات الطبية",
    "category": "biomedical",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "30 min",
    "phenomenon": "Flashlamp-pumped Er³⁺:YAG optical cavity & high water-absorption ablation",
    "objective": "Build and analyze an Er:YAG solid-state medical laser cavity with flashlamp optical pumping, active Er:YAG crystal rod, and output coupler.",
    "theory": "Er:YAG emits at 2940 nm, matching the peak absorption band of water in biological tissue, enabling ultra-precise surgical and dental ablation with minimal thermal damage.",
    "equations": [
      {
        "latex": "\\lambda_{\\text{Er:YAG}} = 2940\\text{ nm}, \\quad I(z) = I_0 e^{-\\mu_a z}",
        "label": "Er:YAG Emission & Tissue Absorption",
        "desc": "Strong OH-bond water absorption at 2.94 µm"
      }
    ],
    "defaultParams": {
      "laserPowerW": 2.5,
      "exposureTimeSec": 5
    },
    "quiz": [],
    "components": [
      {
        "id": "e95_pump",
        "type": "white_light",
        "name": "Flashlamp Pump Source",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "lampColor": "white",
        "power": 15,
        "beamWidth": 36,
        "rayCount": 5,
        "isOn": true
      },
      {
        "id": "e95_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "e95_gain",
        "type": "gain_medium",
        "name": "Gain Medium (ER_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "er_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "e95_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "e95_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_096",
    "num": "096",
    "title": "Photochemical Laser Interaction (Photodynamic Therapy - PDT)",
    "titleAr": "التفاعل الكيميائي الضوئي والعلاج الضوئي الديناميكي (PDT)",
    "category": "biomedical",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Photosensitizer excitation generating singlet oxygen (1O2) for targeted cellular cytotoxicity",
    "objective": "Calculate photochemical dose D = ∫ C(t)*Φ(t) dt and singlet oxygen yield.",
    "theory": "Light excites photosensitizer to triplet state, transferring energy to ground triplet oxygen to produce cytotoxic singlet oxygen 1O2.",
    "equations": [
      {
        "latex": "\\text{Photosensitizer}^* + \\text{O}_2(^3\\Sigma_g^-) \\to \\text{Photosensitizer} + \\text{O}_2(^1\\Delta_g)",
        "label": "Type II Energy Transfer",
        "desc": "Generation of reactive singlet oxygen"
      }
    ],
    "defaultParams": {
      "lightDoseJcm2": 50,
      "drugDoseMgKg": 2
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_096_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 532,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_096_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 315,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 155,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_096_t",
        "type": "medium",
        "name": "Target Material",
        "position": {
          "x": 500,
          "y": 280
        },
        "rotation": 0,
        "width": 125,
        "height": 110,
        "refractiveIndex": 1.45,
        "absorptionCoefficient": 0.95
      },
      {
        "id": "exp_096_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_097",
    "num": "097",
    "title": "Laser Ablation of Biological Tissue (Er:YAG / CO2)",
    "titleAr": "الاستئصال الليزري للأنسجة الحيوية (ليزر Er:YAG 2.94µm و CO2)",
    "category": "biomedical",
    "level": "undergraduate",
    "difficulty": "Intermediate",
    "time": "35 min",
    "phenomenon": "Explosive water vaporization and micro-explosive tissue removal with minimal collateral thermal damage",
    "objective": "Compare explosive Er:YAG water ablation (minimal thermal zone) with CO2 hemostatic cutting.",
    "theory": "Water has peak absorption at 2.94 µm (μa ≈ 10,000 cm^-1); rapid superheating causes micro-explosive vaporization.",
    "equations": [
      {
        "latex": "F_{th} = \\frac{\\rho H_{vap}}{\\mu_a (1 - R)}",
        "label": "Tissue Ablation Threshold",
        "desc": "Energy fluence required for explosive vaporization"
      }
    ],
    "defaultParams": {
      "pulseEnergyMj": 150,
      "spotDiameterMm": 1
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_097_pump",
        "type": "white_light",
        "name": "HV Discharge Pump",
        "position": {
          "x": 430,
          "y": 125
        },
        "rotation": 90,
        "lampColor": "blue",
        "power": 8,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_097_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_097_gain",
        "type": "gain_medium",
        "name": "Gain Medium (CO2)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "co2",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": true
      },
      {
        "id": "exp_097_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_097_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_098",
    "num": "098",
    "title": "Fractional Laser Skin Resurfacing",
    "titleAr": "إعادة تسطيح الجلد بالليزر التجزيئي (Fractional Photothermolysis)",
    "category": "biomedical",
    "level": "masters",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Microscopic Treatment Zones (MTZ) leaving undamaged tissue reservoirs for rapid re-epithelialization",
    "objective": "Calculate MTZ diameter, depth, and density (% coverage) to balance therapeutic efficacy and healing time.",
    "theory": "Creating arrays of microscopic thermal columns (MTZ) spares surrounding viable tissue, accelerating wound healing.",
    "equations": [
      {
        "latex": "\\text{Coverage (\\%)} = \\text{MTZ Density} \\cdot \\pi \\left(\\frac{d_{MTZ}}{2}\\right)^2 \\times 100",
        "label": "Fractional Treatment Coverage",
        "desc": "Percentage of treated skin surface area"
      }
    ],
    "defaultParams": {
      "pulseEnergyMj": 15,
      "mtzDensityCm2": 400
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_098_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 125,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 450,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_098_f",
        "type": "lens",
        "name": "convex Lens",
        "position": {
          "x": 315,
          "y": 280
        },
        "rotation": 0,
        "lensType": "convex",
        "focalLength": 155,
        "diameter": 96,
        "refractiveIndex": 1.52
      },
      {
        "id": "exp_098_t",
        "type": "medium",
        "name": "Target Material",
        "position": {
          "x": 500,
          "y": 280
        },
        "rotation": 0,
        "width": 125,
        "height": 110,
        "refractiveIndex": 1.45,
        "absorptionCoefficient": 0.95
      },
      {
        "id": "exp_098_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 695,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_099",
    "num": "099",
    "title": "Ophthalmic Q-Switched Nd:YAG Laser Simulation",
    "titleAr": "محاكاة ليزr Nd:YAG النبضي في جراحة العيون (Capsulotomy)",
    "category": "biomedical",
    "level": "graduation",
    "difficulty": "Advanced",
    "time": "40 min",
    "phenomenon": "Optical breakdown, plasma generation, and acoustic shockwave photodisruption",
    "objective": "Simulate non-thermal photodisruption mechanism used in posterior capsulotomy and iridotomy.",
    "theory": "Focusing millijoule pulses to micro-spots yields intensity > 10^11 W/cm^2, causing optical breakdown that cleaves membranes.",
    "equations": [
      {
        "latex": "I_{peak} = \\frac{E_{pulse}}{\\tau_{pulse} \\cdot \\pi w_0^2} \\ge 10^{11} \\text{ W/cm}^2",
        "label": "Breakdown Threshold",
        "desc": "Power density threshold for dielectric breakdown"
      }
    ],
    "defaultParams": {
      "pulseEnergyMj": 1.5,
      "spotDiameterUm": 8,
      "pulseDurationNs": 4
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_099_pump",
        "type": "laser",
        "name": "Pump Diode Laser",
        "position": {
          "x": 430,
          "y": 120
        },
        "rotation": 90,
        "wavelength": 455,
        "power": 15,
        "beamWidth": 24,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_099_hr",
        "type": "mirror",
        "name": "HR Mirror (99.5%)",
        "position": {
          "x": 245,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 105,
        "reflectivity": 0.995,
        "focalLength": 160
      },
      {
        "id": "exp_099_gain",
        "type": "gain_medium",
        "name": "Gain Medium (ND_YAG)",
        "position": {
          "x": 430,
          "y": 280
        },
        "rotation": 0,
        "mediumType": "nd_yag",
        "width": 185,
        "height": 54,
        "gainCoefficient": 1.75,
        "pumpActive": false
      },
      {
        "id": "exp_099_oc",
        "type": "mirror",
        "name": "Output Coupler (OC 72%)",
        "position": {
          "x": 615,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "partial",
        "width": 105,
        "reflectivity": 0.72,
        "focalLength": 160
      },
      {
        "id": "exp_099_det",
        "type": "detector",
        "name": "Laser Power Meter",
        "position": {
          "x": 745,
          "y": 280
        },
        "rotation": 90,
        "width": 90
      }
    ]
  },
  {
    "id": "exp_100",
    "num": "100",
    "title": "Optical Coherence Tomography (OCT) High-Resolution Imaging",
    "titleAr": "التصوير المقطعي البصري التوافقي (OCT) عالي الدقة",
    "category": "biomedical",
    "level": "phd",
    "difficulty": "Advanced",
    "time": "50 min",
    "phenomenon": "Low-coherence Michelson interferometry achieving micron-scale axial optical sectioning",
    "objective": "Simulate A-scan depth profile reconstruction and demonstrate axial resolution Δz = (2*ln 2/π)*(λ0^2/Δλ).",
    "theory": "Low temporal coherence light isolates backscattered signals from specific depths, decoupling axial from lateral resolution.",
    "equations": [
      {
        "latex": "\\Delta z_{axial} = \\frac{2 \\ln 2}{\\pi} \\frac{\\lambda_0^2}{\\Delta \\lambda}",
        "label": "OCT Axial Resolution",
        "desc": "Axial sectioning determined by source bandwidth"
      }
    ],
    "defaultParams": {
      "centralWavelength": 1310,
      "bandwidthDeltaLambda": 100,
      "scanDepthMm": 2
    },
    "quiz": [],
    "components": [
      {
        "id": "exp_100_l",
        "type": "laser",
        "name": "Laser Source",
        "position": {
          "x": 135,
          "y": 280
        },
        "rotation": 0,
        "wavelength": 632.8,
        "power": 6,
        "beamWidth": 10,
        "rayCount": 3,
        "isOn": true
      },
      {
        "id": "exp_100_bs",
        "type": "mirror",
        "name": "Output Coupler / BS",
        "position": {
          "x": 390,
          "y": 280
        },
        "rotation": -45,
        "mirrorType": "partial",
        "width": 120,
        "reflectivity": 0.5,
        "focalLength": 160
      },
      {
        "id": "exp_100_m1",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 610,
          "y": 280
        },
        "rotation": 90,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_100_m2",
        "type": "mirror",
        "name": "plane Mirror",
        "position": {
          "x": 390,
          "y": 105
        },
        "rotation": 0,
        "mirrorType": "plane",
        "width": 100,
        "reflectivity": 0.99,
        "focalLength": 160
      },
      {
        "id": "exp_100_d",
        "type": "detector",
        "name": "Silicon Photodiode",
        "position": {
          "x": 390,
          "y": 455
        },
        "rotation": 0,
        "width": 90
      }
    ]
  }
];
})(typeof window !== 'undefined' ? window : global);
