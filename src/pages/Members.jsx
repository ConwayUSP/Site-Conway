import { useEffect } from 'react'
import './Members.css'

// Hooks
import { useMembers } from '../hooks/members/useMembers'

import { MemberCards } from '../components/members/MemberCard'

function Members() {
  const { data: members, isLoading: isLoadingMembers, isFetching: isFetchingMembers } = useMembers()
  
  return (
    <main className="members">
      <h1>Membros</h1>
      <MemberCards members={members || []} />
    </main>
  )
}

export default Members