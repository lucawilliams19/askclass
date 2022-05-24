const express = require( 'express' )
const fs = require('fs')
const router = express.Router()

const { getFiles, setFile, updateFile, deleteFile } = require( '../controllers/fileController' )

router.route( '/' ).get( getFiles ).post( setFile )
router.route( '/:id' ).delete( deleteFile ).put( updateFile )

module.exports = router