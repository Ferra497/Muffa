import 'dart:math';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/food_item.dart';

class DataService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final String? fridgeId;
  final bool loggedIn;

  DataService({required this.fridgeId, required this.loggedIn});

  Future<void> addItem(FoodItem item) async {
    if (loggedIn && fridgeId != null) {
      await _db.collection('fridges').doc(fridgeId).collection('items').doc(item.id).set(item.toMap());
    } else {
      final prefs = await SharedPreferences.getInstance();
      final items = prefs.getStringList('items') ?? [];
      items.add(_encodeItem(item));
      await prefs.setStringList('items', items);
    }
  }

  Future<List<FoodItem>> getItems() async {
    if (loggedIn && fridgeId != null) {
      final snapshot = await _db.collection('fridges').doc(fridgeId).collection('items').get();
      return snapshot.docs.map((d) => FoodItem.fromMap(d.data(), d.id)).toList();
    } else {
      final prefs = await SharedPreferences.getInstance();
      final items = prefs.getStringList('items') ?? [];
      return items.map(_decodeItem).toList();
    }
  }

  String _encodeItem(FoodItem item) {
    return '${item.id}|${item.name}|${item.expirationDate.toIso8601String()}|${item.addedBy}|${item.createdAt.toIso8601String()}';
  }

  FoodItem _decodeItem(String str) {
    final parts = str.split('|');
    return FoodItem(
      id: parts[0],
      name: parts[1],
      expirationDate: DateTime.parse(parts[2]),
      addedBy: parts[3],
      createdAt: DateTime.parse(parts[4]),
    );
  }

  String generateId() {
    final rand = Random();
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return List.generate(12, (index) => chars[rand.nextInt(chars.length)]).join();
  }
}
