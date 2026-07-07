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


function Members() {
  const { data: members, isLoading: isLoadingMembers, isFetching: isFetchingMembers } = useMembers()
  const [selectedFilter, setSelectedFilter] = useState("Todos")
  const filterOptions = ["DPS", "DLC", "Todos", "GG", "OP"]
  
  return (
    <main className="members">
      { isSmallScreen()? 
        <div className="members-filter">
          <div
            className="filter-arrow"
            onClick={() => {
              const n = filterOptions.indexOf(selectedFilter);
              setSelectedFilter(
                filterOptions[(n - 1 + filterOptions.length) % filterOptions.length]
              );
            }}
          >
            <img src={arrowBack} alt="Anterior" width={36} height={36} />
          </div>

          <FilterOption
            tag={selectedFilter}
            isSelected={true}
          />

          <div
            className="filter-arrow"
            onClick={() => {
              const n = filterOptions.indexOf(selectedFilter);
              setSelectedFilter(
                filterOptions[(n + 1) % filterOptions.length]
              );
            }}
          >
            <img src={arrowNext} alt="Próximo" width={36} height={36} />
          </div>
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