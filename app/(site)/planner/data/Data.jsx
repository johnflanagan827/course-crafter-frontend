export const taskStatus = {
    entry1: {
        name: "Freshman Fall",
        items: [
            { id: "1", content: "University Core Course", credits: 3, isFixed: false },
            { id: "2", content: "University Writing Course", credits: 3, isFixed: false },
            { id: "3", content: "Engineering Design", credits: 3, isFixed: false },
            { id: "4", content: "Moreau First Year Experience", credits: 1, isFixed: true },
            { id: "5", content: "Intro. to Chemical Principles", credits: 4, isFixed: false },
            { id: "6", content: "Calculus I", credits: 4, isFixed: false },
        ]
    },
    entry2: {
        name: "Freshman Spring",
        items: [
            { id: "7", content: "University Core Course", credits: 3, isFixed: false },
            { id: "8", content: "Technical Elective", credits: 3, isFixed: false },
            { id: "9", content: "Engineering Computing", credits: 3, isFixed: false },
            { id: "10", content: "Moreau First Year Experience", credits: 1, isFixed: true },
            { id: "11", content: "Calculus II", credits: 4, isFixed: false},
            { id: "12", content: "General Physics I", credits: 4, isFixed: false},
        ]
    },
    entry3: {
        name: "Sophomore Fall",
        items: [
            { id: "13", content: "University Core Course", credits: 3, isFixed: false},
            { id: "14", content: "Discrete Mathematics", credits: 3, isFixed: false },
            { id: "15", content: "Fund Computing", credits: 4, isFixed: false },
            { id: "16", content: "Calculus III", credits: 3.5, isFixed: false },
            { id: "17", content: "General Physics II", credits: 4, isFixed: false },
        ]
    },
    entry4: {
        name: "Sophomore Spring",
        items: [
            { id: "18", content: "University Core Course", credits: 3, isFixed: false },
            { id: "19", content: "Logic Design", credits: 3, isFixed: false },
            { id: "20", content: "Systems Programming", credits: 3, isFixed: false },
            { id: "21", content: "Data Structures", credits: 4, isFixed: false },
            { id: "22", content: "Intro to Linear Algebra & Differential Equations", credits: 3.5, isFixed: false },
        ]
    },
    entry5: {
        name: "Junior Fall",
        items: [
            { id: "23", content: "University Core Course", credits: 3, isFixed: false },
            { id: "24", content: "CSE Elective", credits: 3, isFixed: false },
            { id: "25", content: "CSE Elective", credits: 3, isFixed: false },
            { id: "26", content: "Technical Elective", credits: 3, isFixed: false },
            { id: "27", content: "Computer Architecture", credits: 3, isFixed: false },

        ]
    },
    entry6: {
        name: "Junior Spring",
        items: [
            { id: "28", content: "University Core Course", credits: 3, isFixed: false },
            { id: "29", content: "Theory of Computing", credits: 3, isFixed: false },
            { id: "30", content: "Programming Paradigms", credits: 3, isFixed: false },
            { id: "31", content: "Operating Systems", credits: 3, isFixed: false },
            { id: "32", content: "Probability & Statistics", credits: 3, isFixed: false },

        ]
    },
    entry7: {
        name: "Senior Fall",
        items: [
            { id: "33", content: "CSE Elective", credits: 3, isFixed: false },
            { id: "34", content: "CSE Elective", credits: 3, isFixed: false },
            { id: "35", content: "Free Elective", credits: 3, isFixed: false },
            { id: "36", content: "Technical Elective", credits: 3, isFixed: false },
            { id: "37", content: "Algorithms", credits: 3, isFixed: false },

        ]
    },
    entry8: {
        name: "Senior Spring",
        items: [
            { id: "38", content: "University Core Course", credits: 3, isFixed: false },
            { id: "39", content: "CSE Elective", credits: 3, isFixed: false },
            { id: "40", content: "CSE Elective", credits: 3, isFixed: false },
            { id: "41", content: "Ethical and Social Issues", credits: 3, isFixed: false },
        ]
    }
};

export const rightColumnData = {
    id: 'queue',
    items: [
    ]
};


export const minors = [
    {
        id: 'Minors',
        title: 'Minors',
        options: [
            {label: 'None', value: 'None'},
            { label: 'Engineering Corporate Practice', value: 'Engineering Corporate Practice', contents: ['Class Content 1', 'Class Content 2']},
            { label: 'Energy Studies', value: 'Energy Studies'},
            { label: 'Collaborative Innovation', value: 'Collaborative Innovation' },
            { label: 'Data Science', value: 'Data Science' },
        ],
    },
];

export const concentrations = [
    {
        id: 'Concentrations',
        title: 'Concentrations',
        options: [
            { label: 'None', value: 'None' },
            {
                label: 'Bioinformatics and Computational Biology',
                value: 'Bioinformatics and Computational Biology',
                contents: [
                    { topic: 'Bioinformatics Computing / Complex Networks / Healthcare Analytics (3 credits)', credits: 3},
                    { topic: 'Database Concepts (3 credits)', credits: 3 },
                    { topic: 'CSE 40771 / 40755 / 40772 / 40647 / 40746 / 40657 / Research (3 credits)', credits: 3},
                    { topic: 'BIOS  20201 / 20250 / 40577 (3 credits)', credits: 3},
                ]
            },

            { label: 'Cloud Computing', value: 'Cloud Computing' },
            { label: 'Cyber Security', value: 'Cyber Security' },
            { label: 'Mobile Computing', value: 'Mobile Computing' },
            { label: 'Media Computing', value: 'Media Computing'}
        ],
    },
];