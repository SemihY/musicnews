if (Meteor.isClient) {
  // counter starts at 0


  Meteor.subscribe('songList');
  Meteor.subscribe('songIdList');

// Part Of AddSong
  Template.addsong.events({
  	'click #addbutton ':function(){
  		var songName= document.getElementById('songname');
  		var singerName=document.getElementById('singername');
  		var findSong=SongList.find({songName:songName.value,singerName:singerName.value}).count();

  		if(songName.value!="" && singerName.value!=""){
  			//console.log(SongIdList.find().fetch());
			//Meteor.call('SongIdListRemove');
  			Session.set('controlMessage',false);
	  		if(findSong){
	  			var findSongId=SongList.findOne({songName:songName.value,singerName:singerName.value})._id;
	  			Meteor.call('updateRank',findSongId);
	  		}else{
	  			Meteor.call('searchVideo',songName.value,singerName.value);
	  			console.log(SongIdList.find().fetch());
				/*Meteor.call('insertSong',songName.value,singerName.value);*/
			}
			document.getElementById('songname').value="";
	  		document.getElementById('singername').value="";
  		}
  		else{
  			Session.set('controlMessage',true);
  		}

  	},
  	'click #closebutton':function(){
  		Session.set('songmustbeadd',false);
  		Session.set('controlMessage',false);
  	}
  });

  Template.addsong.helpers({
  	'controlMessage':function(){
  		return Session.get('controlMessage');
  	}
  });

/////////////////


//Part Of ListSong
  Template.listSong.events({
  	'click .list-group-item':function(){
  		Session.set('selectedSong',this._id);
  		/*console.log(Session.get('selectedSong'));*/
		//console.log(SongIdList.findOne({songDatabaseId:Session.get('selectedSong')}));
		var youtubeVideoId=SongIdList.findOne({songDatabaseId:Session.get('selectedSong')}).songYoutubeId;
  	},
  	'click .upButton':function(){
  		Meteor.call('updateRank',this._id);
  	},
  	'click .playButton':function(){
  		Session.set('playingSongId',this._id)
  		Session.set('isPlayingSong',true);
  		Meteor.call('downloadAndPlay',this._id);
  	}
  })

  Template.listSong.helpers({
  	'song':function(){
  		return SongList.find({},{sort: {createdDate:-1} });
  	},
  	'isPlayingSong':function(){
  		if(this._id==Session.get('playingSongId')){
  			return Session.get('isPlayingSong');
  		}
  		else
  			return false;
  	},
  	'clearVideo':function(){
  		if(Session.get('isPlayingSong')){
  			jwplayer(this._id).remove();
  		}
  	},
  	'isUp':function(){
  		
  	}	
  });

///////////////////

//Part Of header

  Template.header.helpers({
  	'songadd':function(){
  	return Session.get('songmustbeadd')?true:false;
  	}    
  });


  Template.header.events({
  	'click .addsong':function(){
  		Session.set('songmustbeadd',true);
  	}
  });


// Part of video

1
Template.video.rendered = function () {
	var s='https://www.youtube.com/watch?v='+SongIdList.findOne({songDatabaseId:Session.get('playingSongId')}).songYoutubeId
	jwplayer(Session.get('playingSongId')).setup({
		file: s/*'http://localhost:3000/mymp3.mp3'*/,
		width: 640,
        height: 30
	});
	console.log(SongIdList.findOne({songDatabaseId:Session.get('selectedSong')}));
};
Template.video.helpers({
	'selectedSongId':function(){
		return Session.get('playingSongId');
	}

});

////////////////////
}