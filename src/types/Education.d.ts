type Education = { 
    user_id: ObjectId;
    degree: string; 
    institution: string; 
    date: string 
};

    // user_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // degree: {
    //     type: String,
    //     required: true
    // },
    // institution: {
    //     type: String,
    //     required: true
    // },
    // date: {
    //     type: Date,
    //     required: true
    // }