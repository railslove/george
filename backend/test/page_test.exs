defmodule George.PageTest do
  use ExUnit.Case, async: true

  setup do
    {:ok, page} = George.Page.start_link
    {:ok, page: page}
  end

  test "is initially empty", %{page: page} do
    assert George.Page.all(page) == []
  end

  test "allows adding emails to the list", %{page: page} do
    George.Page.add(page, "test@test.com")
    assert George.Page.all(page) == ["test@test.com"]
  end

  test "Allows adding emails to the list", %{page: page} do
    George.Page.add(page, "test@test.com")
    George.Page.add(page, "test2@test.com")

    George.Page.remove(page, "test@test.com")

    assert George.Page.all(page) == ["test2@test.com"]
  end
end
