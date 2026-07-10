import { useEffect, useState } from 'react'
import isSmallScreen from '@utils/isSmallScreen'
import './Members.css'
import FilterOption from '@components/members/FilterOption'
import { MemberCards } from '@components/members/MemberCard'

// Icons
import arrowBack from "@assets/icons/arrow_back.svg";
import arrowNext from "@assets/icons/arrow_next.svg";

// Hooks
import { useMembers } from '../hooks/members/useMembers'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { useMembersBySetor } from '../hooks/members/useMembersBySetor'

const filterOptions = ["DPS", "DLC", "Todos", "GG", "OP"]

function Members() {
  const [selectedFilter, setSelectedFilter] = useState("Todos")

  const { data: membersPre, isLoading: isLoadingMembers, isFetching: isFetchingMembers } = useMembers()
  const members = useMembersBySetor(membersPre, selectedFilter === "Todos" ? undefined : selectedFilter)

  const windowInnerWidth = useWindowWidth()
  
  return (
    <main className="members">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--cor-texto)' }}>Nossos membros</h1>
        <p style={{ color: 'var(--cor-texto-mutado)' }}>Filtre por setor todos os membros da entidade</p>
      </header>
      { isSmallScreen(windowInnerWidth)? 
        <div className="members-filter">
          <button
            className="filter-arrow"
            aria-label="Filtro Anterior"
            onClick={() => {
              const n = filterOptions.indexOf(selectedFilter);
              setSelectedFilter(
                filterOptions[(n - 1 + filterOptions.length) % filterOptions.length]
              );
            }}
          >
            <img src={arrowBack} alt="Anterior" width={36} height={36} />
          </button>

          <FilterOption
            tag={selectedFilter}
            isSelected={true}
          />

          <button
            className="filter-arrow"
            aria-label="Filtro Posterior"
            onClick={() => {
              const n = filterOptions.indexOf(selectedFilter);
              setSelectedFilter(
                filterOptions[(n + 1) % filterOptions.length]
              );
            }}
          >
            <img src={arrowNext} alt="Próximo" width={36} height={36} />
          </button>
        </div>
      :
        <div className="members-filter">
          {filterOptions.map((option) => (
            <FilterOption 
              key={option} 
              tag={option} 
              isSelected={option === selectedFilter} 
              clickAction={() => setSelectedFilter(option)}
            />
          ))}
        </div>
      }
      <MemberCards members={members || []} />
    </main>
  )
}

export default Members