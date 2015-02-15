if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

	YoutubeApi.authenticate({
    type: 'key',
    key: 'AIzaSyB8ktJ_V9t8auYF1JlV7kIqNzXlMofUEUQ' // <-- This field for YOUTUBE API key
	});


  });

    
  Meteor.publish('songList', function(){
  return SongList.find();
  });
  Meteor.publish('songIdList',function(){
  return SongIdList.find();
  });
    	
  Meteor.methods({
  	insertSong:function(songName,singerName){
  		SongList.insert({
    	songName:songName,
    	singerName:singerName,
    	songRank:1});
  	},
  	updateRank:function(updateSongName){
  		console.log("Enter updateRank method");
  		console.log(updateSongName);
  		SongList.update(updateSongName,{$inc:{songRank:1}}); 
  	},
  	searchVideo: function(songName,singerName) {
  		console.log(songName,singerName);
        var request=YoutubeApi.search.list({
            part: "snippet",
            type: "video",
            maxResults: 5,
            q: songName+" "+singerName,
        }, function (err, data) {
        	if(data.pageInfo.totalResults){
				console.log("Youtube videoId : " ,data.items[0].id.videoId);
				//console.log(data);
				Fiber = Npm.require('fibers')
				Fiber(function() {
          var date = new Date();
					SongList.insert({
					songName:songName,
					singerName:singerName,
					songRank:1,
          createdDate:date});

					songDatabaseId=SongList.findOne({songName:songName,singerName:singerName})._id;
					
					SongIdList.insert({
					songName:songName,
					singerName:singerName,
					songDatabaseId:songDatabaseId,
					songYoutubeId:data.items[0].id.videoId
            	})
				}).run();
				
  			}
  			else{
  				console.log("Data yok");
  			}			
	    });
    },
	SongIdListRemove:function(){
		SongIdList.remove({});
	},
	downloadAndPlay:function(){
		console.log("Click Play");
	}
  	
  	});
}