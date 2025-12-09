from sqlalchemy import event

from .models import User, Follower

# INCREMENT FOLLOWERS ON INSERT
@event.listens_for(Follower, "after_insert")
def increment_follower_count(mapper, connection, target: Follower):
    users = User.__table__

    connection.execute(
        users.update()
        .where(users.c.id == target.user_following_id)
        .values(followers_total=users.c.followers_total + 1)
    )

# DECREMENT FOLLOWERS ON DELETE
@event.listens_for(Follower, "after_delete")
def decrement_follower_total(mapper, connection, target: Follower):
    users = User.__table__

    connection.execute(
        users.update()
        .where(users.c.id == target.user_following_id)
        .values(followers_total=users.c.followers_total - 1)
    )
