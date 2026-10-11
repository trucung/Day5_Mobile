// App.tsx — Câu 1 → Câu 6
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Switch,
  Alert,
  Button,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MovieCard, { Movie } from "./components/MovieCard";

// TODO: dán URL API của BẠN (tạo trên mockapi.io) vào đây.
export const API_URL = "https://6acaf9fd3115bcc958211e67.mockapi.io/movies";

// Hàm gọi API (GET) — GIỮ NGUYÊN, không xoá.
export async function fetchMovies() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Gọi API thất bại: " + res.status);
  }
  return res.json();
}

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // tải lần đầu / thử lại
  const [refreshing, setRefreshing] = useState<boolean>(false); // kéo để làm mới
  const [error, setError] = useState<boolean>(false);

  // Câu 5: hai công tắc độc lập
  const [posterMode, setPosterMode] = useState<boolean>(false);
  const [onlyUnwatched, setOnlyUnwatched] = useState<boolean>(false);

  const load = useCallback(async (isRefresh: boolean = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (e) {
      setError(true);
    } finally {
      // luôn tắt vòng xoay, kể cả khi lỗi
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const onRefresh = useCallback(() => load(true), [load]);

  // Câu 3: chọn phim → Alert
  const handleSelect = useCallback(
    (id: string) => {
      const movie = movies.find((m) => m.id === id);
      if (movie) {
        Alert.alert(movie.title, "Đạo diễn: " + movie.director);
      }
    },
    [movies]
  );

  // Câu 5: danh sách đã lọc tính bằng useMemo
  const filteredMovies = useMemo(
    () => (onlyUnwatched ? movies.filter((m) => !m.watched) : movies),
    [movies, onlyUnwatched]
  );

  const layout: "row" | "poster" = posterMode ? "poster" : "row";

  const renderItem = useCallback(
    ({ item }: { item: Movie }) =>
      posterMode ? (
        // ô cố định 50% → thẻ lẻ cuối không bị kéo giãn hết hàng
        <View style={styles.posterCell}>
          <MovieCard movie={item} onSelect={handleSelect} layout="poster" />
        </View>
      ) : (
        <MovieCard movie={item} onSelect={handleSelect} layout="row" />
      ),
    [posterMode, handleSelect]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Câu 1 */}
      <Text style={styles.header}>Movie Watchlist</Text>

      {/* Câu 5 */}
      <View style={styles.switchRow}>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Dạng poster</Text>
          <Switch value={posterMode} onValueChange={setPosterMode} />
        </View>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Chưa xem</Text>
          <Switch value={onlyUnwatched} onValueChange={setOnlyUnwatched} />
        </View>
      </View>

      {/* Câu 2 */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Không tải được danh sách phim.</Text>
          <Button title="Thử lại" onPress={() => load(false)} />
        </View>
      ) : (
        <FlatList
          // đổi key khi đổi số cột (RN không cho đổi numColumns "nóng")
          key={layout}
          data={filteredMovies}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={posterMode ? 2 : 1}
          contentContainerStyle={
            posterMode ? styles.posterContent : styles.rowContent
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Không có phim nào để hiển thị.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MovieList />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f6" },
  header: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  switchItem: { flexDirection: "row", alignItems: "center" },
  switchLabel: { marginRight: 8, fontSize: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16, marginBottom: 12 },
  rowContent: { paddingBottom: 16, flexGrow: 1 },
  posterContent: { paddingHorizontal: 6, paddingBottom: 16, flexGrow: 1 },
  posterCell: { width: "50%", padding: 6 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#666" },
});
