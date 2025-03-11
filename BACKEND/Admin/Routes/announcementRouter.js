const express = require('express');
const router = express.Router();


const{createAnnouncement,getAllAnnouncements,deleteAnnouncement} = require('../Controllers/announcementController');



router.get('/',getAllAnnouncements);
router.post('/create',createAnnouncement);
router.delete('/:announcement_id/:course_id',deleteAnnouncement);


module.exports = router;
