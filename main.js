//Sunucu üzerinde server dosyasına erişim
const socket = io('https://teletip-streeam.herokuapp.com/');


$('#menu').hide();
$('#div-chat').hide();

//Socket.io üzerinde kullanıcıların çevrimiçi durumlarının kontrolü
socket.on('cevrimici_liste', arrUserInfo => {

        $('#div-btn').hide();

    arrUserInfo.forEach(kullanici => {
        const { ten, peerId } = kullanici;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('yeni_cevrimici_liste', kullanici => {
        const { ten, peerId } = kullanici;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('kesilen_baglanti', peerId => {

        $(`#${peerId}`).remove();

    });
});

socket.on('gercek_kullanici' , () => alert('Başka bir hesapla deneyin!'));


//Html video elementlerinin eşler arası gerçek zamanlı çalıştırılması 
function openStream () {
    $('#div-chat').show();
    var config = { audio: true , video: true };
    return navigator.mediaDevices.getUserMedia(config) || navigator.webkitGetUserMedia(config) ||
        navigator.mozGetUserMedia(config) ;
};

function playStream(idVideoTag , stream){
var video=document.getElementById(idVideoTag);
video.srcObject = stream;
video.play();

};

//openStream()
//.then(stream => playStream('localStream', stream));

//var peer = new Peer({key: 'lwjd5qra8257b9'});


//Peer.js kütüphanesinden oluşturulan nesnenin ICE Server bağlantıları
var peer = new Peer({
    config: {'iceServers': [
        {url:'stun:stun.l.google.com:19302'},
        
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        }
    ]} 
  });

//peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3, config: ice.iceServers});

//Peer.js kütüphanesinden kullanıcılar arasında ki Video bağlantılarının kurulması
peer.on('open' , id => {
    $('#myPeer').append(id);
    $('#btnSingUp').click(() =>{
        $('#menu').show();
        $('#login-form').hide();
        const kullaniciAdi = $('#txtUsername').val();
        socket.emit('kullanici_ky' , { ten: kullaniciAdi, peerId: id});
        
    
    });

});


//Arama Fonksiyonları
$('#btnCall').click(()=>{
const id = $('#remoteId').val();
openStream()
.then(stream => {
playStream('localStream' , stream);
const call = peer.call(id , stream);
call.on('stream' , remoteStream => playStream('remoteStream', remoteStream));
});
});



//Arama butonu fonksiyonu
peer.on('call' , call =>{
openStream()
.then(stream => {
//Cevap Buton
    
    call.answer(stream);
    playStream('localStream' , stream);
    call.on('stream' , remoteStream => playStream('remoteStream' , remoteStream));
    })
});

$('#ulUser').on('click' , 'li' , function(){

     const id = $(this).attr('id');
     openStream()
.then(stream => {
playStream('localStream' , stream);
const call = peer.call(id , stream);
call.on('stream' , remoteStream => playStream('remoteStream', remoteStream));

    });
});

//close

//peer.on('close', function() { 
  //  alert("deneme");
 //});
 
 //$('#end-call').click(function(){
   // window.existingCall.close();
    //step2();

 $('btnClose').click(() =>{
peer.on('close', function() { 

    console.log('on close');

 });
 });



