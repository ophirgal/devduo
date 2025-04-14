import {db} from '@/lib/firebase';
import {collection, doc, getDoc, onSnapshot, setDoc, updateDoc} from 'firebase/firestore';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

// Global State
let pc: RTCPeerConnection | null = null;
let localStream: MediaStream | null = null;
let remoteStream: MediaStream | null = null;

// 1. Setup media sources
export const setUpMediaSources = async (
    {localVideoElement, remoteVideoElement }: {localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement}
    ) => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream = new MediaStream();

    if (!pc) pc = new RTCPeerConnection();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
        pc!!.addTrack(track, localStream!!);
    });

    // Pull tracks from remote stream, add to video stream
    pc!!.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream!!.addTrack(track);
        });
    };

    localVideoElement.srcObject = localStream;
    remoteVideoElement.srcObject = remoteStream;
};

// 2. Create a session offer and return the session ID (aka call ID)
export const createSessionOffer: () => Promise<string> = async () => {
  // Reference Firestore collections for signaling
  const callDocRef = doc(collection(db, 'calls'));
  const offerCandidatesRef = collection(callDocRef, 'offerCandidates');
  const answerCandidatesRef = collection(callDocRef, 'answerCandidates');

  // Get candidates for caller, save to db
  pc!!.onicecandidate = (event) => {
    event.candidate && setDoc(doc(offerCandidatesRef), event.candidate.toJSON());
  };

  // Create offer
  const offerDescription = await pc!!.createOffer();
  await pc!!.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  alert("before")
  await setDoc(callDocRef, { offer });
alert("after")

  // Listen for remote answer
  onSnapshot(callDocRef, (snapshot) => {
    const data = snapshot.data();
    if (!pc!!.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc!!.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
  onSnapshot(answerCandidatesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc!!.addIceCandidate(candidate);
      }
    });
  });

  return callDocRef.id
};

// 3. Answer the call with the unique ID
export const joinSessionByID = async (callId: string) => {
    alert('tryinggggg with:' + callId)
  const callDoc = doc(db, 'calls', callId);
  alert(callDoc.id)
  const answerCandidatesRef = collection(callDoc, 'answerCandidates');
  const offerCandidatesRef = collection(callDoc, 'offerCandidates');

  pc!!.onicecandidate = (event) => {
    event.candidate && setDoc(doc(answerCandidatesRef), event.candidate.toJSON());
  };

  const callData = (await getDoc(callDoc)).data();
  const offerDescription = callData!!.offer;
  await pc!!.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc!!.createAnswer();
  await pc!!.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await updateDoc(callDoc, { answer });

  onSnapshot(offerCandidatesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      // console.log(change);
      if (change.type === 'added') {
        let data = change.doc.data();
        pc!!.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};
