import EditMemoForm from '@/components/EditMemoForm'

export default async function EditMemo({ params }: { params: { id: string } }) {
  const id = (await params).id
  return <EditMemoForm id={id} />
}