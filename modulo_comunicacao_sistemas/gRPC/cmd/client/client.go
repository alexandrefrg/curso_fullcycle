package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"time"

	"github.com/alexandrefrg/curso_fullcycle/pb"
	"google.golang.org/grpc"
)

func main() {
	connection, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Could not connect to gRPC Server: %v", err)
	}
	defer connection.Close()

	client := pb.NewUserServiceClient(connection)
	// AddUser(client)
	// AddUserVerbose(client)
	AddUsers(client)
}

func AddUser(client pb.UserServiceClient) {
	req := &pb.User{
		Id:    "0",
		Name:  "new User",
		Email: "new@email.com",
	}

	res, err := client.AddUser(context.Background(), req)
	if err != nil {
		log.Fatalf("Could not make gRPC request: %v", err)
	}

	fmt.Println(res)
}

func AddUserVerbose(client pb.UserServiceClient) {

	req := &pb.User{
		Id:    "0",
		Name:  "new User",
		Email: "new@email.com",
	}

	reponseStream, err := client.AddUserVerbose(context.Background(), req)
	if err != nil {
		log.Fatalf("Could not make gRPC request: %v", err)
	}

	for {
		stream, err := reponseStream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("Could not receive the msg: %v", err)
		}
		fmt.Println("Status:", stream.Status, " - ", stream.GetUser())
	}
}

func AddUsers(client pb.UserServiceClient) {
	reqs := []*pb.User{
		&pb.User{
			Id:    "a1",
			Name:  "Alexandre primeiro",
			Email: "alexandre@primeiro.com",
		},
		&pb.User{
			Id:    "a2",
			Name:  "Alexandre segundo",
			Email: "alexandre@segundo.com",
		},
		&pb.User{
			Id:    "a3",
			Name:  "Alexandre terceiro",
			Email: "alexandre@terceiro.com",
		},
		&pb.User{
			Id:    "z1",
			Name:  "zezinho primeiro",
			Email: "zezinho@primeiro.com",
		},
		&pb.User{
			Id:    "z2",
			Name:  "zezinho segundo",
			Email: "zezinho@segundo.com",
		},
		&pb.User{
			Id:    "z3",
			Name:  "zezinho terceiro",
			Email: "zezinho@terceiro.com",
		},
	}

	stream, err := client.AddUsers(context.Background())
	if err != nil {
		log.Fatalf("Error creating request: %v", err)
	}

	for _, req := range reqs {
		stream.Send(req)
		time.Sleep(time.Second * 3)
	}

	res, err := stream.CloseAndRecv()
	if err != nil {
		log.Fatalf("Error receiving response: %v", err)
	}

	fmt.Println(res)
}
