package collaboration

import (
	"context"
	"errors"
	"strings"
	"time"
)

// FakeCollaborationRepo is a mock implementation of the Repository interface for testing
type FakeCollaborationRepo struct {
	CreatedInvitation *ProjectInvitation
	CreatedComment    *Comment
	CreatedTask       *Task
	CreatedResource   *SharedResource
	Activities        []ActivityLog
	ExistingTask      *Task // For UpdateTask tests
	// Additional fields for integration tests
	Comments []Comment
	Tasks    []Task
}

func (f *FakeCollaborationRepo) AddMember(ctx context.Context, member *ProjectMember) error {
	return nil
}

func (f *FakeCollaborationRepo) GetMember(ctx context.Context, projectID, userID string) (*ProjectMember, error) {
	// For testing purposes, return a member with a role based on the userID
	// This allows us to test permission scenarios
	role := "viewer" // default
	if strings.Contains(userID, "owner") {
		role = "owner"
	} else if strings.Contains(userID, "manager") {
		role = "manager"
	} else if strings.Contains(userID, "contributor") {
		role = "contributor"
	}

	return &ProjectMember{
		ProjectID:   projectID,
		UserID:      userID,
		Role:        role,
		Permissions: []string{"read", "write"},
		JoinedAt:    time.Now(),
		UpdatedAt:   time.Now(),
	}, nil
}

func (f *FakeCollaborationRepo) ListMembers(ctx context.Context, projectID string) ([]ProjectMember, error) {
	return []ProjectMember{}, nil
}

func (f *FakeCollaborationRepo) UpdateMember(ctx context.Context, member *ProjectMember) error {
	return nil
}

func (f *FakeCollaborationRepo) RemoveMember(ctx context.Context, projectID, userID string) error {
	return nil
}

func (f *FakeCollaborationRepo) CreateInvitation(ctx context.Context, invite *ProjectInvitation) error {
	clone := *invite
	f.CreatedInvitation = &clone
	return nil
}

func (f *FakeCollaborationRepo) GetInvitationByToken(ctx context.Context, token string) (*ProjectInvitation, error) {
	return nil, errors.New("not implemented")
}

func (f *FakeCollaborationRepo) ListInvitations(ctx context.Context, projectID string) ([]ProjectInvitation, error) {
	return []ProjectInvitation{}, nil
}

func (f *FakeCollaborationRepo) CreateActivity(ctx context.Context, activity *ActivityLog) error {
	clone := *activity
	f.Activities = append(f.Activities, clone)
	return nil
}

func (f *FakeCollaborationRepo) ListActivities(ctx context.Context, projectID string, limit, offset int) ([]ActivityLog, error) {
	return f.Activities, nil
}

func (f *FakeCollaborationRepo) CreateComment(ctx context.Context, comment *Comment) error {
	clone := *comment
	f.CreatedComment = &clone
	f.Comments = append(f.Comments, clone)
	return nil
}

func (f *FakeCollaborationRepo) ListComments(ctx context.Context, projectID string) ([]Comment, error) {
	return f.Comments, nil
}

func (f *FakeCollaborationRepo) CreateTask(ctx context.Context, task *Task) error {
	clone := *task
	f.CreatedTask = &clone
	f.Tasks = append(f.Tasks, clone)
	return nil
}

func (f *FakeCollaborationRepo) GetTask(ctx context.Context, taskID string) (*Task, error) {
	if taskID == "existing-task" && f.ExistingTask != nil {
		return f.ExistingTask, nil
	}
	// For integration tests, return a mock task for "task123"
	if taskID == "task123" {
		return &Task{
			ID:          "task123",
			ProjectID:   "p1",
			Title:       "Test Task",
			Description: "Test Description",
			Status:      "todo",
			Priority:    "medium",
			CreatedBy:   "test-user",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}, nil
	}
	return nil, errors.New("task not found")
}

func (f *FakeCollaborationRepo) ListTasks(ctx context.Context, projectID string) ([]Task, error) {
	return f.Tasks, nil
}

func (f *FakeCollaborationRepo) UpdateTask(ctx context.Context, task *Task) error {
	return nil
}

func (f *FakeCollaborationRepo) CreateResource(ctx context.Context, resource *SharedResource) error {
	clone := *resource
	f.CreatedResource = &clone
	return nil
}

func (f *FakeCollaborationRepo) ListResources(ctx context.Context, projectID string) ([]SharedResource, error) {
	return []SharedResource{}, nil
}
