import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import { updateSearchCount } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'

const search = () => {
  const[searchQuery, setSearchQuery] = useState('');

  const { 
    data: movies, 
    loading,
    error, 
    refetch: loadMovies
  } = useFetch(() => fetchMovies({ 
      query: searchQuery
  }),false)

  useEffect(() => {
    const timeoutId = setTimeout( async () => {
      if (searchQuery.trim()) {
        await loadMovies();
        if(movies?.length > 0 && movies?.[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        }
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);


  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode='cover'/>
      
      <FlatList 
        data={movies} 
        renderItem={({ item }) => <MovieCard {...item}/>}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'center', gap: 16, marginVertical: 16 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          !loading && !error ? (
            <View className='mt-10 px-5'>
              <Text className='text-gray-500 text-center'>
                {searchQuery.trim() ? 'No movies found.' : 'Search for a movie to get started.'}
              </Text>
            </View>
          ) : null
        }

        ListHeaderComponent={
          <>
          <View className="w-full flex-row justify-center mt-20">
            <Image source={icons.logo} className="w-12 h-10"/>
          </View>

          <View className="my-5">
            <SearchBar 
              placeholder='Searching movies...'
              value={searchQuery}
              onChangeText={(text: string) => setSearchQuery(text)}
              />
          </View>

          {loading && (
            <ActivityIndicator size="large" color="#0000ff" className="my-3" />
          )}

          {error && (
              <Text className="text-red-500 px-5 my-3">Error: {error.message}</Text>
          )}

          {!loading && !error && searchQuery.trim() && movies ?.length > 0 && (
            <Text className="text-white text-xl font-bold">
              Search Results for{' '}
              <Text className='text-accent'>{searchQuery}</Text>
            </Text>
          )}
          </>
        }
      />
    </View>
  )
}

export default search

const styles = StyleSheet.create({})