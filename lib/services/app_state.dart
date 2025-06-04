import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/food_item.dart';
import 'auth_service.dart';
import 'data_service.dart';

class AppState extends ChangeNotifier {
  final AuthService _authService = AuthService();
  User? user;
  String username = '';
  String? fridgeId;
  bool gridLayout = false;
  int filterDays = 5;
  Locale locale = const Locale('en');
  List<FoodItem> items = [];
  SharedPreferences? _prefs;

  DataService get _dataService => DataService(fridgeId: fridgeId, loggedIn: user != null);

  AppState() {
    _init();
    _authService.userChanges.listen((u) async {
      user = u;
      await loadItems();
      notifyListeners();
    });
  }

  Future<void> _init() async {
    _prefs = await SharedPreferences.getInstance();
    username = _prefs?.getString('username') ?? '';
    fridgeId = _prefs?.getString('fridgeId');
    gridLayout = _prefs?.getBool('gridLayout') ?? false;
    filterDays = _prefs?.getInt('filterDays') ?? 5;
    final lang = _prefs?.getString('locale') ?? 'en';
    locale = Locale(lang);
    await loadItems();
  }

  Future<void> loadItems() async {
    items = await _dataService.getItems();
    notifyListeners();
  }

  Future<void> addItem(FoodItem item) async {
    await _dataService.addItem(item);
    await loadItems();
  }

  Future<void> signIn() async {
    user = await _authService.signInWithGoogle();
    await loadItems();
    notifyListeners();
  }

  Future<void> signOut() async {
    await _authService.signOut();
    user = null;
    await loadItems();
    notifyListeners();
  }

  void setUsername(String name) {
    username = name;
    _prefs?.setString('username', name);
    notifyListeners();
  }

  void setFridgeId(String id) {
    fridgeId = id;
    _prefs?.setString('fridgeId', id);
    loadItems();
    notifyListeners();
  }

  void setGridLayout(bool value) {
    gridLayout = value;
    _prefs?.setBool('gridLayout', value);
    notifyListeners();
  }

  void setFilterDays(int days) {
    filterDays = days;
    _prefs?.setInt('filterDays', days);
    notifyListeners();
  }

  void setLocale(Locale loc) {
    locale = loc;
    _prefs?.setString('locale', loc.languageCode);
    notifyListeners();
  }
}
