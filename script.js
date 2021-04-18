$(() => {
    //Track Details
    const index = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

    const trackNames = [
        'Everybody Knows',
        'Hotel California',
        'Save Your Tears',
        'Stop Children',
        'Abhi Na Jao Reprise',
        'Luka Chuppi Reprise',
        'Retro Medley',
        'Take Oplo Kache Dakchi',
        'Tum Mile'
    ]

    const artists = [
        'Sigrid', 
        'Eagles', 
        'The Weekend', 
        'Buffalo Springfield',
        'Twin Strings',
        'Nafisa Haniya',
        'Twin Strings',
        'Mahtim Sakib',
        'Raj Barman'
    ]

    const trackFiles = [
        'library/everybody-knows.mp3',
        'library/hotel-california.mp3',
        'library/save-your-tears.mp3',
        'library/stop-children.mp3',
        'library/abhi-na-jao-reprise.mp3',
        'library/luka-chuppi-bohot-hui-reprise.mp3',
        'library/retro-medley.mp3',
        'library/take-olpo-kache-dakchi.mp3',
        'library/tum-mile-dil-khile.mp3',
    ]

    //Fetching html elements
    var playerTrack = $("#player-track"),
        bgArtwork = $('#bg-artwork'), 
        bgArtworkUrl, 
        artistName = $('#artist-name'), 
        trackName = $('#track-name'), 
        albumArt = $('#album-art'), 
        sArea = $('#s-area'), 
        seekBar = $('#seek-bar'), 
        trackTime = $('#track-time'), 
        insTime = $('#ins-time'), 
        sHover = $('#s-hover'), 
        playPauseButton = $("#play-pause-button"), 
        playPreviousButton = $("#play-previous"),
        playNextButton = $("#play-next"),
        i = playPauseButton.find('i'), 
        tProgress = $('#current-time'), 
        tTime = $('#track-length'),
        seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, 
        curSeconds, durMinutes, durSeconds, playProgress, bTime, 
        nTime = 0, 
        tFlag = false,
        currentIndex = 0

    //Player Functionality
    function playPause(){
        setTimeout(() => {
            if(audio.paused){
                playerTrack.addClass('active')
                albumArt.addClass('active')
                i.attr('class', 'bx bx-pause')
                audio.play()
            } else {
                playerTrack.removeClass('active')
                albumArt.removeClass('active')
                i.attr('class', 'bx bx-play')
                audio.pause()
            }
        }, 300)
    }

    function showHover(event){
        seekBarPos = sArea.offset()
        seekT = event.clientX - seekBarPos.left
        seekLoc = audio.duration * (seekT / sArea.outerWidth())

        sHover.width(seekT)

        cM = seekLoc / 60

        ctMinutes = Math.floor(cM)
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60)

        if(ctMinutes < 0 || ctSeconds < 0)
            return

        if(ctMinutes < 10)
            ctMinutes = '0'+ctMinutes
        if(ctSeconds < 10)
            ctSeconds = '0'+ctSeconds

        insTime.text(ctMinutes+':'+ctSeconds)
        insTime.css({'left': seekT, 'margin-left': '-21px'}).fadeIn(0)
    }

    function hideHover(){
        sHover.width(0)
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);
    }

    function playFromPos(){
        audio.currentTime = seekLoc
        seekBar.width(seekT)
        hideHover()
    }

    function updateAudioTime(){
        nTime = new Date()
        nTime = nTime.getTime()

        if(!tFlag){
            tFlag = true
            trackTime.addClass('active')
        }

        curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
		
		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);
		
		playProgress = (audio.currentTime / audio.duration) * 100;
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;

        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');
        
        if(isNaN(curMinutes) || isNaN(curSeconds))
            tProgress.text('00:00')
        else
            tProgress.text(curMinutes+':'+curSeconds)

        if(isNaN(durMinutes) || isNaN(durSeconds))
            tTime.text('00:00')
        else    
            tTime.text(durMinutes+':'+durSeconds)

        seekBar.width(playProgress+'%')

        if(playProgress == 100){
            i.attr('class', 'bx bx-play')
            seekBar.width(0)
            tProgress.text('00:00')
            albumArt.removeClass('active')
        }
    }

    function trackSelect(mov){
        if(mov == 1)
            currentIndex++;
        else if(mov == -1)    
            currentIndex--;

        if(currentIndex < 0)
            currentIndex = index.length
        else if(currentIndex > index.length - 1)
            currentIndex = 0

        seekBar.width(0)
        trackTime.removeClass('active')
        tProgress.text('00:00')
        tTime.text('00:00')

        currArtist = artists[currentIndex]
        currTrackName = trackNames[currentIndex]
        currArtwork = index[currentIndex]

        audio.src = trackFiles[currentIndex]

        nTime = 0
        bTime = new Date()
        bTime = bTime.getTime()

        //If you change the track, it should automatically start playing
        if(mov != 0){
            audio.play()
            playerTrack.addClass('active')
            albumArt.addClass('active')
            i.attr('class', 'bx bx-pause')
        }

        artistName.text(currArtist)
        trackName.text(currTrackName)
        albumArt.find('img.active').removeClass('active')
        $('#'+currArtwork).addClass('active')

        bgArtworkUrl = $('#'+currArtwork).attr('src')
        bgArtwork.css({'background-image': 'url('+bgArtworkUrl+')'})
    }

    function initPlayer(){
        audio = new Audio()
        audio.loop = false

        trackSelect(0)

        //When you click on play button
        playPauseButton.on('click', playPause)

        //When you hover over progress bar
        sArea.mouseover(function (event) { showHover(event) });
        sArea.mouseout(hideHover)
        sArea.on('click', playFromPos)

        //When you click on a particular time position in the progress bar
        $(audio).on('timeupdate', updateAudioTime)

        //Switch track next ot previous
        playPreviousButton.on('click', () => trackSelect(-1))
        playNextButton.on('click', () => trackSelect(1))
    }

    initPlayer()
})