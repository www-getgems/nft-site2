import { useNavigate } from 'react-router-dom';
import Header from './header';
import Menu from './menu';
import Card from './card';

export default function MyGifts() {
  const navigate = useNavigate();

  return (
    <div className='h-screen text-white font-sans overflow-auto bg-[#121921]'>
      <Header />
      <div className='ml-3 mt-3 text-2xl font-semibold'>
        <h1 className='ml-3'>Мои подарки</h1>
        <div className='grid grid-cols-2'>
          <Card 
            text="Забрать" 
            collection="lootbag" 
            nft_id={539} 
            onClick={() => navigate("/auth")} 
          />
        </div>
      </div>
      <Menu />
    </div>
  );
}
