import LoadingSpinner from '@/components/LoadingAnimation';

export default function Skeleton() {
    return <LoadingSpinner style={{
        height: 140,
        width: '100%',
        borderRadius: 10
    }}></LoadingSpinner>
}