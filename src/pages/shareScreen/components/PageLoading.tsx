import loading from '@/assets/new_loading_light.png';

export default function PageLoading() {

    return <div className=' w-full h-full flex items-center justify-center bg-black'>
        <span className={`inline-block w-20 h-20`} >
            <img src={loading} alt="" className='w-full h-full' />
        </span>
    </div>
}