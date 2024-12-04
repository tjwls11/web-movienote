import EditMemoForm from '@/components/EditMemoForm'
const apiUrl = process.env.API_URL

const getMemoById = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/memos/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      throw new Error('Failed to fetch memo.')
    }
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export default async function EditMemo({ params }: { params: { id: string } }) {
  const { id } = params
  const { memo } = await getMemoById(id)
  const { title, description } = memo
  return <EditMemoForm id={id} title={title} description={description} />
}
