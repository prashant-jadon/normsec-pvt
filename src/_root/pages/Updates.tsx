import GridUpdatesList from "@/components/shared/GridUpdatesList";
import Postcard from "@/components/shared/Postcard";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetUpdates, useSearchUpdates } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedUpdates: any;
};

const SearchResults = ({ isSearchFetching, searchedUpdates }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedUpdates && searchedUpdates.documents.length > 0) {
    return <GridUpdatesList updates={searchedUpdates.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Updates = () => {
  const { ref, inView } = useInView();
  const { data: updates, fetchNextPage, hasNextPage } = useGetUpdates();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedUpdates, isFetching: isSearchFetching } = useSearchUpdates(debouncedSearch);

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!updates)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowUpdates = !shouldShowSearchResults && 
    updates.pages.every((item) => item.documents.length === 0);

  return (
    <div className="container mx-auto px-4">
      <div className="explore-inner_container mt-10 mb-16">
        <h2 className="h3-bold md:h2-bold w-full">Search</h2>
        <div className="flex gap-1 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search flex-grow"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex items-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedUpdates={searchedUpdates}
          />
        ) : shouldShowUpdates ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          updates.pages.map((item, index) => (
            <Postcard post={item.documents} key={`page-${index}`}/>
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Updates;
