// components/MovieCard.tsx — Câu 3 + Câu 4
import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  rating: number;
  poster: string;
  watched: boolean;
}

export interface MovieCardProps {
  movie: Movie;
  onSelect: (id: string) => void;
  layout?: "row" | "poster"; // mặc định "row"
}

function MovieCard({ movie, onSelect, layout = "row" }: MovieCardProps) {
  const rating = Number(movie.rating).toFixed(1);
  const posterSource = movie.poster ? { uri: movie.poster } : undefined;

  // ---------- Dạng poster (xếp dọc) ----------
  if (layout === "poster") {
    return (
      <Pressable style={styles.posterCard} onPress={() => onSelect(movie.id)}>
        <View>
          <Image
            source={posterSource}
            style={styles.posterImage}
            resizeMode="cover"
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>⭐ {rating}</Text>
          </View>
          {movie.watched && (
            <View style={styles.watchedChip}>
              <Text style={styles.watchedChipText}>✓ Đã xem</Text>
            </View>
          )}
        </View>
        <Text style={styles.posterTitle} numberOfLines={2}>
          {movie.title}
        </Text>
      </Pressable>
    );
  }

  // ---------- Dạng row (nằm ngang) ----------
  return (
    <Pressable style={styles.rowCard} onPress={() => onSelect(movie.id)}>
      <Image source={posterSource} style={styles.rowImage} resizeMode="cover" />
      <View style={styles.rowInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.sub}>
          {movie.director} · {movie.year}
        </Text>
        <Text style={styles.sub}>⭐ {rating}</Text>
        <Text style={styles.status}>
          {movie.watched ? "✅ Đã xem" : "🎬 Chưa xem"}
        </Text>
      </View>
    </Pressable>
  );
}

export default React.memo(MovieCard);

const styles = StyleSheet.create({
  // row
  rowCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  rowImage: {
    width: 70,
    height: 105,
    borderRadius: 6,
    backgroundColor: "#d9d9d9",
  },
  rowInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  sub: { fontSize: 14, color: "#555", marginBottom: 2 },
  status: { fontSize: 14, marginTop: 4 },

  // poster
  posterCard: { width: "100%" },
  posterImage: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  watchedChip: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "#2e9e4f",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  watchedChipText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  posterTitle: { marginTop: 6, fontSize: 14, fontWeight: "600" },
});
