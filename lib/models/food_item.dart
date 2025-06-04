class FoodItem {
  final String id;
  final String name;
  final DateTime expirationDate;
  final String addedBy;
  final DateTime createdAt;

  FoodItem({
    required this.id,
    required this.name,
    required this.expirationDate,
    required this.addedBy,
    required this.createdAt,
  });

  factory FoodItem.fromMap(Map<String, dynamic> data, String id) {
    return FoodItem(
      id: id,
      name: data['name'] ?? '',
      expirationDate: DateTime.parse(data['expirationDate']),
      addedBy: data['addedBy'] ?? '',
      createdAt: DateTime.parse(data['createdAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'expirationDate': expirationDate.toIso8601String(),
      'addedBy': addedBy,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
