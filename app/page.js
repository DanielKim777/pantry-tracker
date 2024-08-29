'use client' // 파일의 최상단에 'use client'를 배치해. 이렇게 하면 파일 전체가 클라이언트 컴포넌트로 처리돼.
import Image from "next/image";
import { useState, useEffect } from 'react'; // 이 부분은 useState와 useEffect를 사용해서 상태 관리나 컴포넌트 생명주기 관리 같은 로직을 사용할 준비를 하는 거야.
// 이 훅들은 클라이언트 측에서만 동작해, 그래서 'use client'를 사용한 파일에서 잘 맞아떨어져. Home 컴포넌트가 나중에 상태 관리나 생명주기 이벤트에 반응하게 될 때 이 훅들이 필요할 수 있어.
import { firestore } from '@/firebase'; // 아까 firebase.js를 가져오는 거야
import { Box, Typography, Modal, Stack, TextField, Button } from "@mui/material";
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"; // query 함수 추가

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  // 변수와 함수명 변경 가능
  // 이 부분은 React의 useState 훅을 사용해서 컴포넌트 내에서 상태(state)를 정의하고 초기화하는 코드야. 각각의 상태와 그 역할을 설명해줄게:
  const [inventory, setInventory] = useState([]); // 현재 인벤토리(목록)의 상태를 저장하는 변수야. 초기값은 빈 배열([])로 설정되어 있어.
  const [itemName, setItemName] = useState(''); // 사용자가 추가하거나 검색하려는 아이템의 이름을 저장하는 상태야. 초기값은 빈 문자열('')로 설정되어 있어.
  const [open, setOpen] = useState(false); // 모달의 열림/닫힘 상태를 관리하는 변수와 함수 추가


  // 이 함수는 Firestore에서 inventory라는 컬렉션을 가져오기 위해 작성된 비동기 함수야.
  // 여기서 async 키워드를 사용한 것은 이 함수가 비동기적으로 동작하며, await를 사용해 비동기 작업을 기다릴 수 있다는 것을 의미해.
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    const initializeAnalytics = async () => {
      if (typeof window !== 'undefined') { // Ensure this code only runs in the browser
        const supported = await isSupported(); // Check if analytics is supported
        if (supported) {
          const analytics = getAnalytics(); // Initialize analytics
          // You can add more analytics-related code here
        }
      }
    };

    initializeAnalytics(); // Call the function to initialize analytics

    updateInventory(); // Fetch inventory data
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // 컴포넌트가 마운트될 때 updateInventory 함수를 호출해 Firestore에서 데이터를 가져와.
  useEffect(() => {
    updateInventory();
  }, []);

  // 데이터를 화면에 출력
  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open} // 모달의 열림/닫힘 상태를 반영
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => addItem(name)}>
                +
              </Button>
              <Button variant="contained" onClick={() => removeItem(name)}>
                -
              </Button>

            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )

}
