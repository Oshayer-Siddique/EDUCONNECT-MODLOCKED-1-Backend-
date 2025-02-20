const express = require('express');
const router = express.Router();


const{createAnnouncement,getAllAnnouncements} = require('../Controllers/announcementController');



router.get('/',getAllAnnouncements);
router.post('/create',createAnnouncement);



module.exports = router;
