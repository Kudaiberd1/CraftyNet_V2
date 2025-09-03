from django.contrib.auth.models import User
from rest_framework.exceptions import NotFound


def get_user(username: str) -> User:
    """
    Возвращает пользователя по username.

    Args:
        username (str): Имя пользователя.

    Returns:
        CustomUser: Объект пользователя.

    Raises:
        NotFound: Если пользователь не найден.
    """
    user = User.objects.filter(username=username).first()

    if not user:
        raise NotFound(detail="Пользователь не найден.")

    return user