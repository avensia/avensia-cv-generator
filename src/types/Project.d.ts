type Project = { 
    user_id: ObjectId;
    title: string; 
    company: string;
    date: string; 
    role: string;
    responsibilities: string;
    details: string;
    projectDetails: string 
};

    // user_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // title: {
    //     type: String,
    //     required: true
    // },
    // company: {
    //     type: String,
    //     required: true
    // },
    // date: {
    //     type: Date,
    //     required: true
    // },
    // role: {
    //     type: String
    // },
    // responsibilities: {
    //     type: String
    // },
    // details: {
    //     type: String
    // },
    // projectDetails: {
    //     type: String
    // }
