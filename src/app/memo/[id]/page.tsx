import MemoDetail from '@/components/MemoDetail'

export default async function MemoPage({ params }: { params: { id: string } }) {
  const id = (await params).id
  return <MemoDetail id={id} />
}
